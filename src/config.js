import { InstanceStatus, Regex } from '@companion-module/base'

export async function configUpdated(config) {
	this.config = config
	this.updateStatus(InstanceStatus.Connecting)
	this.initTCP()
	this.initVariables()
	this.updateActions()
	this.updateFeedbacks()
	this.updateVariableDefinitions()
	this.updatePresetsDefinitions()
}
// Return config fields for web config
export function getConfigFields() {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Device IP',
			width: 12,
			regex: Regex.HOSTNAME,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port',
			width: 6,
			regex: Regex.PORT,
			default: 23,
			tooltip: 'Port is not configurable on unit, only change in advanced configurations',
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 6,
			default: '400',
			regex: '/^[0-9]{0,10}$/',
			tooltip: 'Password may be zero to ten numeric characters',
		},
		{
			type: 'checkbox',
			id: 'dab',
			label: 'DAB',
			width: 4,
			default: false,
			tooltip: 'Is CD-400U DAB',
		},
	]
}
