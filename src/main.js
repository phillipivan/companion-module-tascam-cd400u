import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import UpdateActions from './actions.js'
import UpdateFeedbacks from './feedbacks.js'
import UpdateVariableDefinitions from './variables.js'
import UpdatePresetsDefinitions from './presets'
import config from './config.js'
import choices from './choices.js'
import * as tcp from './tcp.js'
import * as processCmd from './processcmd.js'
import { EndSession } from './consts.js'

class TASCAM_CD_400U extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...tcp, ...processCmd, ...choices })
		this.cmdQueue = []
	}
	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.config = config
		this.initVariables()
		this.startTimeOut()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updateVariableValues()
		this.updatePresetsDefinitions()
		this.initTCP()
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', `destroy. ID: ${this.id}`)
		this.stopKeepAlive()
		this.stopCmdQueue()
		this.stopTimeOut()
		if (this.socket) {
			this.sendCommand(EndSession)
			this.socket.destroy()
			delete this.socket
		}
		this.updateStatus(InstanceStatus.Disconnected)
	}

	updateVariableValues() {
		let varList = []
		/* varList['radioFreq'] = 'unknown'
		varList['trackNo'] = 'unknown'
		varList['trackTime'] = 'unknown'
		varList['trackTimeHours'] = ''
		varList['trackTimeMinutes'] = ''
		varList['trackTimeSeconds'] = '' */
		varList['errorStatus'] = 'unknown'
		varList['cautionStatus'] = 'unknown'
		varList['deviceStatus'] = 'unknown'
		this.setVariableValues(varList)
	}

	initVariables() {
		this.recorder = {
			mechaStatus: 'unknown',
			resumePlay: 'unknown',
			repeat: 'unknown',
			incrPlay: 'unknown',
			remoteLocal: 'unknown',
			playMode: 'unknown',
			error: 'unknown',
			caution: 'unknown',
			device: 'unknown',
			playArea: 'unknown',
			mediaStatus: 'unknown',
			track: {
				number: 'unknown',
				currentTrackTime: 'unknown',
				currentTrackTimeMode: '00',
			},
			frequency: 'unknown',
		}
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	updatePresetsDefinitions() {
		UpdatePresetsDefinitions(this)
	}
}

runEntrypoint(TASCAM_CD_400U, UpgradeScripts)
