const { InstanceBase, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades.js')
const UpdateActions = require('./actions.js')
const UpdateFeedbacks = require('./feedbacks.js')
const UpdateVariableDefinitions = require('./variables.js')
const config = require('./config.js')
const choices = require('./choices.js')
const tcp = require('./tcp.js')
const processCmd = require('./processcmd.js')
const { EndSession } = require('./consts.js')

class TASCAM_CD_400U extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...tcp, ...processCmd, ...choices })
		this.keepAliveTimer = {}
		this.cmdTimer = {}
		this.timeOutTimer = {}
		this.cmdQueue = []
	}
	async init(config) {
		this.updateStatus('Starting')
		this.config = config
		this.initVariables()
		this.startTimeOut()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updateVariableValues()
		this.initTCP()
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', `destroy. ID: ${this.id}`)
		this.stopKeepAlive()
		this.stopCmdQueue()
		this.stopTimeOut()
		this.keepAliveTimer = null
		this.cmdTimer = null
		this.timeOutTimer = null
		if (this.socket) {
			this.sendCommand(EndSession)
			this.socket.destroy()
		}
		this.updateStatus(InstanceStatus.Disconnected)
	}

	updateVariableValues() {
		let varList = []
		varList['trackNo'] = 'unknown'
		varList['trackTime'] = 'unknown'
		varList['trackTimeHours'] = ''
		varList['trackTimeMinutes'] = ''
		varList['trackTimeSeconds'] = ''
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
			track: {
				number: 'unknown',
				currentTrackTime: '00',
			},
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
}

runEntrypoint(TASCAM_CD_400U, UpgradeScripts)
