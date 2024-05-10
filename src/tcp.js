const { InstanceStatus, TCPHelper } = require('@companion-module/base')
const {
	msgDelay,
	/* 	cmd, */
	cmdOnKeepAlive,
	SOM,
	EOM,
	EndSession,
	keepAliveInterval,
	resp,
	cmdOnLogin,
	timeOutInterval,
} = require('./consts.js')

module.exports = {
	addCmdtoQueue(msg) {
		if (msg !== undefined && msg.length > 0) {
			this.cmdQueue.push(msg)
			return true
		}
		this.log('warn', `Invalid command: ${msg}`)
		return false
	},

	processCmdQueue() {
		if (this.cmdQueue.length > 0) {
			this.sendCommand(this.cmdQueue.splice(0, 1))
			this.cmdTimer = setTimeout(() => {
				this.processCmdQueue()
			}, msgDelay)
			return true
		}
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay / 4)
		return undefined
	},

	startCmdQueue() {
		this.log('debug', 'starting cmdTimer')
		if (this.cmdTimer) {
			clearTimeout(this.cmdTimer)
			delete this.cmdTimer
		}
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay)
	},

	stopCmdQueue() {
		this.log('debug', 'stopping cmdTimer')
		clearTimeout(this.cmdTimer)
		delete this.cmdTimer
	},

	sendCommand(msg) {
		if (msg !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				this.log('debug', `Sending Command: ${msg}`)
				this.socket.send(msg + EOM)
				return true
			} else {
				this.log('warn', `Socket not connected, tried to send: ${msg}`)
			}
		} else {
			this.log('warn', 'Command undefined')
		}
		return false
	},

	//queries made on initial connection.
	queryOnConnect() {
		this.sendCommand('  ')
		if (this.config.password === '') {
			this.log('debug', 'no password')
			this.stopTimeOut()
			this.startCmdQueue()
			for (let i = 0; i < cmdOnLogin.length; i++) {
				this.addCmdtoQueue(SOM + cmdOnLogin[i])
			}
			this.startKeepAlive()
		}
		return true
	},

	keepAlive() {
		//request alive notifications
		for (let i = 0; i < cmdOnKeepAlive.length; i++) {
			this.addCmdtoQueue(SOM + cmdOnKeepAlive[i])
		}
		/* 		if (this.recorder.device == '11') {
			this.addCmdtoQueue(SOM + cmd.currentTrackTimeSense + this.recorder.track.currentTrackTimeMode)
		} */
		this.keepAliveTimer = setTimeout(() => {
			this.keepAlive()
		}, keepAliveInterval)
	},

	startKeepAlive() {
		this.log('debug', 'starting keepAliveTimer')
		if (this.keepAliveTimer) {
			clearTimeout(this.keepAliveTimer)
			delete this.keepAliveTimer
		}
		this.keepAliveTimer = setTimeout(() => {
			this.keepAlive()
		}, keepAliveInterval)
	},

	stopKeepAlive() {
		this.log('debug', 'stopping keepAliveTimer')
		clearTimeout(this.keepAliveTimer)
		delete this.keepAliveTimer
	},

	timeOut() {
		//dump cmdQueue to prevent excessive queuing of old commands
		this.cmdQueue = []
		this.timeOutTimer = setTimeout(() => {
			this.timeOut()
		}, timeOutInterval)
	},

	startTimeOut() {
		this.log('debug', 'starting timeOutTimer')
		if (this.timeOutTimer) {
			clearTimeout(this.timeOutTimer)
			delete this.timeOutTimer
		}
		this.timeOutTimer = setTimeout(() => {
			this.timeOut()
		}, timeOutInterval)
	},

	stopTimeOut() {
		this.log('debug', 'stopping timeOutTimer')
		clearTimeout(this.timeOutTimer)
		delete this.timeOutTimer
	},

	initTCP() {
		this.receiveBuffer = ''
		if (this.socket !== undefined) {
			this.sendCommand(EndSession)
			this.socket.destroy()
			delete this.socket
			this.startTimeOut()
			this.stopCmdQueue()
			this.stopKeepAlive()
		}
		if (this.config.host) {
			this.log('debug', 'Creating New Socket')

			this.updateStatus(InstanceStatus.Connecting, `Connecting to CD-400U: ${this.config.host}`)
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', `Network error: ${err.message}`)
				this.stopKeepAlive()
				this.startTimeOut()
				this.stopCmdQueue()
			})
			this.socket.on('connect', () => {
				this.log('info', `Connected to ${this.config.host}:${this.config.port}`)
				this.updateStatus(InstanceStatus.Connecting, 'Logging In')
				this.receiveBuffer = ''
				this.queryOnConnect()
			})
			this.socket.on('data', (chunk) => {
				//this.log('debug', `chunk recieved: ${chunk.toString()}`)
				let i = 0,
					line = '',
					offset = 0
				this.receiveBuffer += chunk
				while ((i = this.receiveBuffer.indexOf(EOM, offset)) !== -1) {
					line = this.receiveBuffer.substr(offset, i - offset)
					offset = i + 2
					this.processCmd(line.toString())
				}
				this.receiveBuffer = this.receiveBuffer.substr(offset)
				this.receiveBuffer = this.receiveBuffer == resp.prompt ? null : this.receiveBuffer
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	},
}
