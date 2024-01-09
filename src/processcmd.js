const { resp, cmd, SOM, cmdOnLogin } = require('./consts.js')

module.exports = {
	async processCmd(chunk) {
		let reply = chunk.toString()
		this.log('debug', `response recieved: ${reply}`)

		switch (reply) {
			case resp.welcome:
				this.sendCommand('  ')
				break
			case resp.password:
				this.addCmdtoQueue(this.config.password)
				return true
			case resp.loginSuccess:
				this.updateStatus('ok', 'Logged in')
				this.log('info', 'OK: Logged In')
				for (let i = 0; i < cmdOnLogin.length; i++) {
					this.addCmdtoQueue(SOM + cmdOnLogin[i])
				}
				return true
		}
		while (reply[0] != SOM && reply.length > 0) {
			reply = reply.slice(1)
		}
		if (reply.length == 0) {
			return false
		}
		let response = reply.substr(1, 2)
		let venderCmd = reply.substr(1, 6)
		let param = []
		let varList = []
		switch (response) {
			case resp.keepAlive:
				this.log('debug', `keepAlive`)
				break
			case resp.infoReturn:
				break
			case resp.resumePlaySelectReturn:
				param[0] = reply.substr(3, 2)
				this.recorder.resumePlay = param[0] === undefined ? this.recoder.resumePlay : param[0]
				this.checkFeedbacks('resumePlay')
				break
			case resp.repeatModeSelectReturn:
				param[0] = reply.substr(3, 2)
				this.recorder.repeat = param[0] === undefined ? this.recoder.repeat : param[0]
				this.checkFeedbacks('repeat')
				break
			case resp.incrPlaySelectReturn:
				param[0] = reply.substr(3, 2)
				this.recorder.incrPlay = param[0] === undefined ? this.recoder.incrPlay : param[0]
				this.checkFeedbacks('incrPlay')
				break
			case resp.remoteLocalModeReturn:
				param[0] = reply.substr(3, 2)
				this.recorder.remoteLocal = param[0] === undefined ? this.recoder.remoteLocal : param[0]
				this.checkFeedbacks('remoteLocal')
				break
			case resp.playModeReturn:
				param[0] = reply.substr(3, 2)
				this.recorder.playMode = param[0] === undefined ? this.recoder.playMode : param[0]
				this.checkFeedbacks('playMode')
				break
			case resp.mechaStatusReturn:
				param[0] = reply.substr(3, 2)
				this.recorder.mechaStatus = param[0] === undefined ? this.recoder.mechaStatus : param[0]
				this.checkFeedbacks('mechaStatus')
				break
			case resp.trackNoStatusReturn:
				param[0] = parseInt(reply[7] + reply[8] + reply[5] + reply[6])
				this.recorder.track.number = isNaN(param[0]) ? this.recorder.track.number : param[0]
				varList['trackNo'] = this.recorder.track.number
				this.setVariableValues(varList)
				break
			case resp.trackCurrentInfoReturn:
				param[0] = parseInt(reply[7] + reply[8] + reply[5] + reply[6])
				this.recorder.track.number = isNaN(param[0]) ? this.recorder.track.number : param[0]
				varList['trackNo'] = this.recorder.track.number
				switch (this.recorder.device) {
					case '30': //FM radio or DAB
						if (this.config.dab) {
							param[1] = `${reply[12]}${reply[13]}` //DAB Service Number
							param[2] = `${reply[9]}${reply[10]}${reply[11]}` // DAB Channel Number
							this.recorder.track.currentTrackTime = `${param[1]}:${param[2]}`
						} else {
							param[1] = parseInt(`${reply[9]}${reply[10]}${reply[11]}${reply[12]}${reply[13]}`) / 100
							this.recorder.track.currentTrackTime = param[1] + ' MHz'
						}
						break
					case '31': //AM Radio or FM on CD-400U DAB
						if (this.config.dab) {
							param[1] = parseInt(`${reply[9]}${reply[10]}${reply[11]}${reply[12]}${reply[13]}`) / 100
							this.recorder.track.currentTrackTime = param[1] + ' MHz'
						} else {
							param[1] = parseInt(`${reply[9]}${reply[10]}${reply[11]}${reply[12]}${reply[13]}`)
							this.recorder.track.currentTrackTime = param[1] + ' KHz'
						}
						break
					case '00': //sd card
					case '10': //usb
					case '11': //cd
					case '20': //bluetooth
					case '40': //aux
					default:
						param[1] = parseInt(`${reply[11]}${reply[12]}${reply[9]}${reply[10]}`) //total minutes
						param[2] = Math.floor(param[1] / 60)
						param[3] = param[1] % 60
						param[4] = parseInt(`${reply[13]}${reply[14]}`) //seconds
						this.recorder.track.currentTrackTime = `${param[2]}:${param[3]}:${param[4]}`
				}
				varList['trackTime'] = this.recorder.track.currentTrackTime
				this.setVariableValues(varList)
				break
			case resp.trackCurrentTimeReturn:
				break
			case resp.totalTrackNoTotalTimeReturn:
				break
			case resp.errorSenseRequest:
				this.log('debug', `errorSenseRequest`)
				this.addCmdtoQueue(SOM + cmd.errorSense)
				break
			case resp.cautionSenseRequest:
				this.log('debug', `cautionSenseRequest`)
				this.addCmdtoQueue(SOM + cmd.cautionSense)
				break
			case resp.illegalStatus:
				this.log('warn', 'Illegal Status: Invalid Command')
				break
			case resp.powerOnStatus:
				this.log('info', 'powerOnStatus')
				break
			case resp.changeStatus:
				param[0] = reply.substr(3, 2)
				if (param[0] == '00') {
					//mecha status changed
					this.addCmdtoQueue(SOM + cmd.mechaStatusSense)
				} else if (param[0] == '03') {
					//take number changed
					this.addCmdtoQueue(SOM + cmd.trackNumStatusSense)
				}
				break
			case resp.errorSenseReturn:
				param[0] = reply[6] + '-' + reply[3] + reply[4]
				switch (param[0]) {
					case '0-00':
						this.log('info', `errorSenseReturn: No Error`)
						varList['errorStatus'] = 'No Error'
						//no error
						break
					case '0-01':
						//rec error
						this.log('warn', `errorSenseReturn: Record Error`)
						varList['errorStatus'] = 'Record Error'
						break
					case '1-02':
						//device error
						this.log('warn', `errorSenseReturn: Device Error`)
						varList['errorStatus'] = 'Device Error'
						break
					case '1-FF':
						//Other Error
						this.log('warn', `errorSenseReturn: Other Error`)
						varList['errorStatus'] = 'Other Error'
						break
					default:
						//Shouldn't occur
						this.log('warn', `errorSenseReturn: Switch Default: ${param[0]}`)
						varList['errorStatus'] = 'Switch Default'
				}
				this.recorder.error = param[0]
				this.setVariableValues(varList)
				this.checkFeedbacks('error')
				break
			case resp.cautionSenseReturn:
				param[0] = reply[6] + '-' + reply[3] + reply[4]
				switch (param[0]) {
					case '0-00':
						//no caution
						this.log('info', `cautionSenseReturn: No Caution`)
						varList['cautionStatus'] = 'No Caution'
						break
					case '0-01':
						//Media Error
						this.log('warn', `cautionSenseReturn: Media Error`)
						varList['cautionStatus'] = 'Media Error'
						break
					case '1-06':
						//Media Full
						this.log('warn', `cautionSenseReturn: Media Full`)
						varList['cautionStatus'] = 'Media Full'
						break
					case '1-0C':
						//Write Protected
						this.log('warn', `cautionSenseReturn: Write Protected`)
						varList['cautionStatus'] = 'Write Protected'
						break
					case '1-0D':
						//Not Execute
						this.log('warn', `cautionSenseReturn: Not Execute`)
						varList['cautionStatus'] = 'Not Execute'
						break
					case '1-13':
						//Can't Select
						this.log('warn', `cautionSenseReturn: Can't Select`)
						varList['cautionStatus'] = "Can't Select"
						break
					case '1-16':
						//Name Full
						this.log('warn', `cautionSenseReturn: Name Full`)
						varList['cautionStatus'] = 'Name Full'
						break
					case '1-1E':
						//Decode Error
						this.log('warn', `cautionSenseReturn: Decode Error`)
						varList['cautionStatus'] = 'Decode Error'
						break
					case '1-1F':
						//Media Not Match
						this.log('warn', `cautionSenseReturn: Media Not Match`)
						varList['cautionStatus'] = 'Media Not Match'
						break
					case '1-FF':
						//Other Caution
						this.log('warn', `cautionSenseReturn: Other Caution`)
						varList['cautionStatus'] = 'Other Caution'
						break
					default:
						//Shouldn't occur
						this.log('warn', `cautionSenseReturn: Switch Default: ${param[0]}`)
						varList['cautionStatus'] = 'Switch Default'
				}
				this.recorder.caution = param[0]
				this.setVariableValues(varList)
				this.checkFeedbacks('caution')
				break
			case resp.venderCommandReturn:
				switch (venderCmd) {
					case resp.deviceSelectReturn:
						param[0] = reply.substr(5, 2)
						this.recorder.device = param[0] === undefined ? this.recoder.device : param[0]
						switch (param[0]) {
							case '00':
								varList['deviceStatus'] = 'SD'
								break
							case '10':
								varList['deviceStatus'] = 'USB'
								break
							case '11':
								varList['deviceStatus'] = 'CD'
								break
							case '20':
								varList['deviceStatus'] = 'Bluetooth'
								break
							case '30':
								varList['deviceStatus'] = 'FM (DAB CD-400UDAB)'
								break
							case '31':
								varList['deviceStatus'] = 'AM (FM CD-400UDAB)'
								break
							case '40':
								varList['deviceStatus'] = 'AUX'
								break
							default:
								varList['deviceStatus'] = 'Switch Default'
						}
						this.setVariableValues(varList)
						this.checkFeedbacks('deviceSelect')
						break
					case resp.playAreaSelectReturn:
						param[0] = reply.substr(7, 2)
						this.recorder.playArea = param[0] === undefined ? this.recoder.playArea : param[0]
						this.checkFeedbacks('playArea')
						break
					default:
						this.log('debug', `unknown vender command: ${reply}`)
				}
				break
			default:
				this.log('warn', `Unexpected response from unit: ${reply}`)
		}
	},
}
