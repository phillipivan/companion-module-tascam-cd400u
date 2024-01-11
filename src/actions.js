//const { Regex } = require('@companion-module/base')
const { SOM, cmd } = require('./consts.js')

module.exports = function (self) {
	self.setActionDefinitions({
		stop: {
			name: 'Stop',
			description:
				'STOP puts the controlled device into the stop state. If the mode is FM, AM or DAB, this command switches between frequency and preset modes.',
			options: [],
			callback: () => {
				self.addCmdtoQueue(SOM + cmd.stop)
			},
		},
		play: {
			name: 'Play',
			description: 'Play puts the controlled device into playback mode.',
			options: [],
			callback: () => {
				self.addCmdtoQueue(SOM + cmd.play)
			},
		},
		pause: {
			name: 'Pause',
			description: 'READY puts the controlled device into playback standby mode.',
			options: [],
			callback: () => {
				self.addCmdtoQueue(SOM + cmd.pause + '01')
			},
		},
		search: {
			name: 'Search',
			description:
				'When the source is CD, USB or SD, SEARCH puts the controlled device into the search playback mode. The controlled device remains in the search playback mode until it receives a command such as STOP, PLAY, or READY. When the source is FM or AM, this command automatically searches for received frequencies in the higher or lower direction.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.search_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.search + options.mode)
			},
		},
		eject: {
			name: 'Eject',
			description: 'EJECT ejects a CD Media from the controlled device.',
			options: [],
			callback: () => {
				self.addCmdtoQueue(SOM + cmd.eject)
			},
		},
		skip: {
			name: 'Skip',
			description: 'SKIP allows the controlled device to skip a track.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.skip_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.skip + options.mode)
			},
		},
		resumePlaySelectMode: {
			name: 'Resume Play Mode',
			description: 'RESUME PLAY SELECT turns the resume play mode of the controlled device on or off.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Resume Play Mode',
					choices: self.resumePlay_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + options.mode)
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + 'FF')
			},
			learn: (action) => {
				const mode = self.recorder.remoteLocal == 'unknown' ? '00' : self.recorder.remoteLocal
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + 'FF')
			},
		},
		repeatMode: {
			name: 'Repeat Mode',
			description: 'REPEAT SELECT turns the repeat mode of the controlled device on or off.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Repeat Mode',
					choices: self.repeat_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.repeatModeSelect + options.mode)
				self.addCmdtoQueue(SOM + cmd.repeatModeSelect + 'FF')
			},
			learn: (action) => {
				const mode = self.recorder.repeat == 'unknown' ? '00' : self.recorder.repeat
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.repeatModeSelect + 'FF')
			},
		},
		incrPlaySelect: {
			name: 'Incremental Playback',
			description: 'INCR PLAY SELECT turns the incremental playback mode of the controlled device on or off.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					choices: self.incrPlay_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.incrPlaySelect + options.mode)
				self.addCmdtoQueue(SOM + cmd.incrPlaySelect + 'FF')
			},
			learn: (action) => {
				const mode = self.recorder.incrPlay == 'unknown' ? '00' : self.recorder.incrPlay
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.incrPlaySelect + 'FF')
			},
		},
		clear: {
			name: 'Clear',
			description: 'CLEAR replies no or cancel when a message is displayed.',
			options: [],
			callback: () => {
				self.addCmdtoQueue(SOM + cmd.clear)
			},
			//learn: () => {},
			//subscribe: () => {},
		},
		remoteLocalMode: {
			name: 'Remote/Local Select',
			description: 'REMOTE/LOCAL SELECT enables or disables key operation on the controlled device.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Control Mode',
					choices: self.remoteLocal_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.remoteLocalModeSelect + options.mode)
				self.addCmdtoQueue(SOM + cmd.remoteLocalModeSelect + 'FF')
			},
			learn: (action) => {
				const mode = self.recorder.remoteLocal == 'unknown' ? '00' : self.recorder.remoteLocal
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.remoteLocalModeSelect + 'FF')
			},
		},
		playMode: {
			name: 'Play Mode Select',
			description: 'PLAY MODE SELECT sets the playback mode of the controlled device.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Play Mode',
					choices: self.play_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.playModeSelect + options.mode)
				self.addCmdtoQueue(SOM + cmd.playModeSense)
			},
			learn: (action) => {
				const mode = self.recorder.playMode == 'unknown' ? '00' : self.recorder.playMode
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.playModeSense)
			},
		},
		currentTrackTime: {
			name: 'Current Track Time',
			description:
				'CURRENT TRACK TIME SENSE requests the controlled device to return the selected time information about the current track or the whole media, when in a playback or a ready state.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Time Mode',
					choices: self.currentTrackTime_sense,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.recorder.track.currentTrackTime = options.mode
				self.addCmdtoQueue(SOM + cmd.currentTrackTimeSense + self.recorder.track.currentTrackTime)
			},
			//learn: () => {},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.currentTrackInfoSense)
			},
		},
		deviceSelect: {
			name: 'Device Select',
			description: 'DEVICE SELECT changes the device to be used on the controlled device.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Device',
					choices: self.deviceSelect_mode,
					default: '10',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.deviceSelect + options.mode)
			},
			learn: (action) => {
				const mode = self.recorder.device == 'unknown' ? '10' : self.recorder.device
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.deviceSelect + 'FF')
			},
		},
		playAreaSelect: {
			name: 'Play Area Select',
			description:
				'PLAY AREA SELECT sets the playback area of the controlled device. This command is not supported when the media is CD-DA.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Device',
					choices: self.playArea_mode,
					default: '00',
					tooltip: 'This command is not supported when the media is CD-DA.',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.playAreaSelect + options.mode)
			},
			learn: (action) => {
				const mode = self.recorder.playArea == 'unknown' ? '00' : self.recorder.playArea
				return {
					...action.options,
					mode: mode,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.playAreaSelect + 'FF')
			},
		},
		enter: {
			name: 'Enter',
			description:
				'ENTER works as same as pressing the main unit MULTI JOG dial or remote control ENTER button. When a Menu Screen is open, ENTER confirms selections and settings. When play area is folder and selecting a track/folder (folder icon is blinking), ENTER starts playback if a track is selected or moves down one level if a folder is selected. When a message is displayed, ENTER replies Yes.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Enter',
					choices: self.enter_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.enter + options.mode)
			},
		},
		back: {
			name: 'Back',
			description:
				'BACK works as same as pressing the main unit BACK [PAIRING] button. When the current source is USB or SD and the play area is folder (the folder icon shown), this move up one folder level. When the current source is BLUETOOTH, press and hold to activate Bluetooth pairing mode. When a Bluetooth connection is active (Connected shown), press to disconnect forcefully.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Back',
					choices: self.back_mode,
					default: '00',
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.back + options.mode)
			},
		},
	})
}
