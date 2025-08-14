import { InstanceStatus } from '@companion-module/base'
import { resp, cmd, SOM, cmdOnLogin } from './consts.js'

export async function processCmd(chunk) {
	let reply = chunk.toString()
	this.log('debug', `message recieved: ${reply}`)
	switch (reply) {
		case resp.welcome:
			//this.log('debug', 'weclome message found sending white space')
			this.sendCommand('  ')
			return true
		case resp.password:
			this.log('debug', 'password request found, sending password')
			this.updateStatus(InstanceStatus.Connecting, 'Logging in')
			this.sendCommand(this.config.password)
			return true
		case resp.loginSuccess:
			this.updateStatus(InstanceStatus.Ok, 'Logged in')
			this.log('info', 'OK: Logged In')
			this.stopTimeOut()
			this.startCmdQueue()
			for (let i = 0; i < cmdOnLogin.length; i++) {
				this.addCmdtoQueue(SOM + cmdOnLogin[i])
			}
			this.startKeepAlive()
			return true
		case resp.loginFail:
			this.updateStatus(InstanceStatus.AuthenticationFailure, 'Incorrect Password')
			this.log('error', 'Login Failure! Incorrect Password.')
			this.stopCmdQueue()
			this.stopKeepAlive()
			this.startTimeOut()
			return false
		case resp.prompt:
			this.log('debug', 'prompt found')
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
	venderCmd = venderCmd.substr(0, 4) == resp.deviceSelectReturn ? venderCmd.substr(0, 4) : venderCmd
	let param = []
	let varList = []
	switch (response) {
		case resp.keepAlive:
			this.log('debug', `keepAlive message recieved: ${reply}`)
			break
		case resp.partPrompt:
			this.processCmd(reply.slice(3))
			break
		case resp.infoReturn:
			this.log('info', `Firmware Version: ${reply.substr(3, 2)}.${reply.substr(5, 2)}`)
			break
		case resp.resumePlaySelectReturn:
			param[0] = reply.substr(3, 2)
			this.recorder.resumePlay = param[0] === undefined ? this.recorder.resumePlay : param[0]
			this.checkFeedbacks('resumePlay')
			break
		case resp.repeatModeSelectReturn:
			param[0] = reply.substr(3, 2)
			this.recorder.repeat = param[0] === undefined ? this.recorder.repeat : param[0]
			this.checkFeedbacks('repeat')
			break
		case resp.incrPlaySelectReturn:
			param[0] = reply.substr(3, 2)
			this.recorder.incrPlay = param[0] === undefined ? this.recorder.incrPlay : param[0]
			this.checkFeedbacks('incrPlay')
			break
		case resp.remoteLocalModeReturn:
			param[0] = reply.substr(3, 2)
			this.recorder.remoteLocal = param[0] === undefined ? this.recorder.remoteLocal : param[0]
			this.checkFeedbacks('remoteLocal')
			break
		case resp.playModeReturn:
			param[0] = reply.substr(3, 2)
			this.recorder.playMode = param[0] === undefined ? this.recorder.playMode : param[0]
			this.checkFeedbacks('playMode')
			break
		case resp.mechaStatusReturn:
			param[0] = reply.substr(3, 2)
			this.recorder.mechaStatus = param[0] === undefined ? this.recorder.mechaStatus : param[0]
			this.checkFeedbacks('mechaStatus')
			break
		case resp.trackNoStatusReturn:
			param[0] = parseInt(reply[7] + reply[8] + reply[5] + reply[6])
			this.recorder.track.number = isNaN(param[0]) ? this.recorder.track.number : param[0]
			varList['trackNo'] = this.recorder.track.number
			this.setVariableValues(varList)
			break
		case resp.mediaStatusReturn:
			param[0] = reply.substr(3, 2)
			param[1] = reply.substr(5, 2)
			this.recorder.mediaStatus = isNaN(param[0]) ? this.recorder.mediaStatus : param[0]
			this.checkFeedbacks('mediaStatus')
			break
		case resp.trackCurrentInfoReturn:
			param[0] = parseInt(reply[5] + reply[6] + reply[3] + reply[4])
			this.recorder.track.number = isNaN(param[0]) ? this.recorder.track.number : param[0]
			varList['trackNo'] = this.recorder.track.number
			switch (this.recorder.device) {
				case '30': //FM radio or DAB
					if (this.config.dab) {
						param[1] = `${reply[12]}${reply[13]}` //DAB Service Number
						param[2] = `${reply[9]}${reply[10]}${reply[11]}` // DAB Channel Number
						this.recorder.frequency = `${param[1]}-${param[2]}`
						this.log('debug', `DAB Service-Channel: ${this.recorder.frequency}`)
					} else {
						param[1] = parseInt(`${reply[9]}${reply[10]}${reply[11]}${reply[12]}${reply[13]}`) / 100
						this.recorder.frequency = param[1] + ' MHz'
						this.log('debug', `FM frequency: ${this.recorder.frequency}`)
					}
					/* varList['radioFreq'] = this.recorder.frequency
						varList['trackTimeHours'] = ''
						varList['trackTimeMinutes'] = ''
						varList['trackTimeSeconds'] = ''
						varList['trackTime'] = '' */
					break
				case '31': //AM Radio or FM on CD-400U DAB
					if (this.config.dab) {
						param[1] = parseInt(`${reply[9]}${reply[10]}${reply[11]}${reply[12]}${reply[13]}`) / 100
						this.recorder.frequency = param[1] + ' MHz'
						this.log('debug', `FM frequency: ${this.recorder.frequency}`)
						/* varList['trackTimeHours'] = ''
							varList['trackTimeMinutes'] = ''
							varList['trackTimeSeconds'] = '' */
					} else {
						param[1] = parseInt(`${reply[8]}${reply[9]}${reply[10]}${reply[11]}`)
						this.recorder.frequency + ' KHz'
						this.log('debug', `AM frequency: ${this.recorder.frequency}`)
					}
					/* varList['radioFreq'] = this.recorder.frequency
						varList['trackTimeHours'] = ''
						varList['trackTimeMinutes'] = ''
						varList['trackTimeSeconds'] = ''
						varList['trackTime'] = '' */
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
				/* 	varList['trackTimeHours'] = param[2]
						varList['trackTimeMinutes'] = param[3]
						varList['trackTimeSeconds'] = param[4]
						varList['trackTime'] = this.recorder.track.currentTrackTime */
			}
			this.setVariableValues(varList)
			break
		case resp.trackCurrentTimeReturn:
			this.recorder.track.currentTrackTimeMode = parseInt(`${reply[3]}${reply[4]}`)
			param[1] = parseInt(`${reply[7]}${reply[8]}${reply[5]}${reply[6]}`) //total minutes
			param[2] = Math.floor(param[1] / 60)
			param[3] = param[1] % 60
			param[4] = parseInt(`${reply[9]}${reply[10]}`) //seconds
			/* varList['trackTimeHours'] = param[2]
				varList['trackTimeMinutes'] = param[3]
				varList['trackTimeSeconds'] = param[4] */
			this.setVariableValues(varList)
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
			param[0] = reply.substr(3)
			this.log('warn', `Illegal Status - Invalid Command: ${param[0]}`)
			break
		case resp.powerOnStatus:
			this.log('info', 'powerOnStatus')
			break
		case resp.changeStatus:
			param[0] = reply.substr(3, 2)
			if (param[0] == '00') {
				//mecha status changed
				this.log('debug', `change status: mecha status changed`)
				this.addCmdtoQueue(SOM + cmd.mechaStatusSense)
				this.addCmdtoQueue(SOM + cmd.mediaStatusSense)
			} else if (param[0] == '03') {
				//take number changed
				this.log('debug', `change status: track, tuner, preset, dab or eom status change`)
				this.addCmdtoQueue(SOM + cmd.mechaStatusSense)
				this.addCmdtoQueue(SOM + cmd.mediaStatusSense)
				//this.addCmdtoQueue(SOM + cmd.trackNumSense)
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
					varList['errorStatus'] = `Switch Default, Unknown: ${param[0]}`
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
					varList['cautionStatus'] = `Switch Default, Unknown: ${param[0]}`
			}
			this.recorder.caution = param[0]
			this.setVariableValues(varList)
			this.checkFeedbacks('caution')
			break
		case resp.venderCommandReturn:
			switch (venderCmd) {
				case resp.deviceSelectReturn:
					param[0] = reply.substr(5, 2)
					this.recorder.device = param[0] === undefined ? this.recorder.device : param[0]
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
							varList['deviceStatus'] = this.config.dab ? 'DAB' : 'FM'
							break
						case '31':
							varList['deviceStatus'] = this.config.dab ? 'FM' : 'AM'
							break
						case '40':
							varList['deviceStatus'] = 'AUX'
							break
						default:
							varList['deviceStatus'] = `Unknown: ${param[0]}`
					}
					this.log('debug', `deviceSelctReturn, device: ${varList['deviceStatus']} value: ${param[0]}`)
					this.setVariableValues(varList)
					this.checkFeedbacks('deviceSelect', 'mechaStatus')
					break
				case resp.playAreaSelectReturn:
					param[0] = reply.substr(7, 2)
					this.recorder.playArea = param[0] === undefined ? this.recorder.playArea : param[0]
					this.checkFeedbacks('playArea')
					break
				default:
					this.log('debug', `unknown vender command: ${reply}`)
			}
			break
		default:
			this.log('debug', `Unexpected response from unit: ${reply}`)
	}
}
