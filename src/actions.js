//const { Regex } = require('@companion-module/base')
const { SOM, cmd } = require('./consts.js')

module.exports = function (self) {
	self.setActionDefinitions({
		stop: {
			name: 'Stop',
			description: '',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.stop)
			},
		},
		play: {
			name: 'Play',
			description: '',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.play)
			},
		},
		pause: {
			name: 'Pause',
			description: '',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.pause + '01')
			},
		},
		search: {
			name: 'Search',
			description: '',
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
		},
		eject: {
			name: 'Eject',
			description: '',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.eject)
			},
		},
		skip: {
			name: 'Skip',
			description: '',
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
		},
		resumePlaySelectMode: {
			name: 'Resume Play Mode',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Resume Play Mode',
					choices: self.resumePlay_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + options.mode)
			},
			learn: async (action) => {
				const mode = self.recorder.remoteLocal == 'unknown' ? '00' : self.recorder.remoteLocal
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: async () => {
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + 'FF')
			},
		},
		repeatMode: {
			name: 'Repeat Mode',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Repeat Mode',
					choices: self.repeat_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.repeatModeSelect + options.mode)
			},
			learn: async (action) => {
				const mode = self.recorder.repeat == 'unknown' ? '00' : self.recorder.repeat
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: async () => {
				self.addCmdtoQueue(SOM + cmd.repeatModeSelect + 'FF')
			},
		},
		incrPlaySelect: {
			name: 'Incremental Playback',
			description: '',
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
			learn: async (action) => {
				const mode = self.recorder.incrPlay == 'unknown' ? '00' : self.recorder.incrPlay
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: async () => {
				self.addCmdtoQueue(SOM + cmd.incrPlaySelect + 'FF')
			},
		},
		clear: {
			name: 'Clear',
			description: '',
			options: [],
			callback: async () => {
				self.addCmdtoQueue(SOM + cmd.clear)
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},
		remoteLocalMode: {
			name: 'Remote/Local Select',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Control Mode',
					choices: self.remoteLocal_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.remoteLocalModeSelect + options.mode)
			},
			learn: async (action) => {
				const mode = self.recorder.remoteLocal == 'unknown' ? '00' : self.recorder.remoteLocal
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: async () => {
				self.addCmdtoQueue(SOM + cmd.remoteLocalModeSelect + 'FF')
			},
		},
		playMode: {
			name: 'Play Mode Select',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Play Mode',
					choices: self.play_mode,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.playModeSelect + options.mode)
			},
			learn: async (action) => {
				const mode = self.recorder.playMode == 'unknown' ? '00' : self.recorder.playMode
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: async () => {
				self.addCmdtoQueue(SOM + cmd.playModeSense)
			},
		},
		currentTrackTime: {
			name: 'Current Track Time',
			description: '',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Time Mode',
					choices: self.currentTrackTime_sense,
					default: '00',
				},
			],
			callback: async ({ options }) => {
				self.recorder.track.currentTrackTime = options.mode
				self.addCmdtoQueue(SOM + cmd.currentTrackTimeSense + self.recorder.track.currentTrackTime)
			},
			//learn: async () => {},
			subscribe: async () => {
				self.addCmdtoQueue(SOM + cmd.currentTrackInfoSense)
			},
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
			learn: async (action) => {
				const mode = self.recorder.device == 'unknown' ? '10' : self.recorder.device
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: async () => {
				self.addCmdtoQueue(SOM + cmd.deviceSelect + 'FF')
			},
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
			learn: async (action) => {
				const mode = self.recorder.playArea == 'unknown' ? '00' : self.recorder.playArea
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: async () => {
				self.addCmdtoQueue(SOM + cmd.playAreaSelect + 'FF')
			},
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
		},
	})
}
