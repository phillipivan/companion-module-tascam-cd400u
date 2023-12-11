//const { Regex } = require('@companion-module/base')
const { SOM, cmd } = require('./consts.js')

module.exports = function (self) {
	self.setActionDefinitions({
		stop: {
			name: 'Stop',
			description: 'Stop',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.stop)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		play: {
			name: 'Play',
			description: 'Play',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.play)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		record: {
			name: 'Record',
			description: 'Record',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.record_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.record + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		pause: {
			name: 'Pause',
			description: 'Pause',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.pause + '01')
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		search: {
			name: 'Search',
			description: 'Search',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.search_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.search + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		eject: {
			name: 'Eject',
			description: 'Eject',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.eject)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		skip: {
			name: 'Skip',
			description: 'Skip',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.skip_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.skip + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		resumePlaySelectMode: {
			name: 'Resume Play Mode',
			description: 'Resume Play Mode',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.resumePlay_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		repeatMode: {
			name: 'Repeat Mode',
			description: 'Repeat Mode',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.repeat_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.repeatModeSelect + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		incrPlaySelect: {
			name: 'Incremental Playback',
			description: 'Incremental Playback',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.incrPlay_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.incrPlaySelect + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		clear: {
			name: 'Clear',
			description: 'Clear',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.clear)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		remoteLocalMode: {
			name: 'Remote/Local Select',
			description: 'Remote/Local Select',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.remoteLocal_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.remoteLocalModeSelect + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		playMode: {
			name: 'Play Mode Select',
			description: 'Play Mode Select',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.play_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.playModeSelect + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		currentTrackTime: {
			name: 'Current Track Time',
			description: 'Current Track Time',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.currentTrackTime_sense,
					default: '10',
				},
			],
			callback: async ({ options }) => {
				self.recorder.track.currentTrackTime = options.mode
				self.addCmdtoQueue(SOM + cmd.currentTrackTimeSense + self.recorder.track.currentTrackTime)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		deviceSelect: {
			name: 'Device Select',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Device',
					choices: self.deviceSelect_mode,
					default: '10',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.deviceSelect + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		playAreaSelect: {
			name: 'Play Area Select',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Device',
					choices: self.playArea_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.playAreaSelect + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		enter: {
			name: 'Enter',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Enter',
					choices: self.enter_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.enter + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		back: {
			name: 'Back',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Back',
					choices: self.back_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.back + options.mode)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
	})
}
