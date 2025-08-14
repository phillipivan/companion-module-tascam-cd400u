import { Regex } from '@companion-module/base'
import { SOM, cmd } from './consts.js'
import choices from './choices.js'
const padding = '0000'

export default function (self) {
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
					choices: choices.search_mode,
					default: choices.search_mode[0].id,
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
					choices: choices.skip_mode,
					default: choices.skip_mode[0].id,
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.skip + options.mode)
			},
		},

		directTrackSearchPreset: {
			name: 'Direct Track Search Preset',
			description:
				'DIRECT TRACK SEARCH PRESET performs a search for a track on the controlled device by specifying the track number. If a track search is performed while the controlled device is in a stop state, the controlled device remains in the stop state at the beginning of the selected track. If a track search is performed while the controlled device is in a state other than the above state, the controlled device switches back to the state where it was before starting a search and remains in that state. When the source is AM, FM or DAB, this performs selection of a preset station by specifying the preset number.',
			options: [
				{
					type: 'textinput',
					id: 'track',
					label: 'Track',
					default: '0001',
					regex: Regex.SOMETHING, ///^[0-9]{4}/g',
					useVariables: { local: true },
					tooltip: 'Must be a one to four digit integer. Radio preset must be <=20.',
				},
			],
			callback: async ({ options }, context) => {
				let take = parseInt(await context.parseVariablesInString(options.track))
				if (isNaN(take)) {
					self.log('warn', `varible passed must be a number: ${take}`)
					return undefined
				}
				take = (padding + take).substr(-4)
				self.addCmdtoQueue(SOM + cmd.directTrackSearchPreset + take[2] + take[3] + take[0] + take[1])
			},
			//learn: async () => {},
			//subscribe: async () => {},
		},

		resumePlaySelectMode: {
			name: 'Resume Play Mode',
			description: 'RESUME PLAY SELECT turns the resume play mode of the controlled device on or off.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Resume Play Mode',
					choices: choices.resumePlay_mode,
					default: choices.resumePlay_mode[0].id,
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + options.mode)
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + 'FF')
			},
			learn: (action) => {
				const mode = self.recorder.resumePlay == 'unknown' ? '00' : self.recorder.remoteLocal
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
					choices: choices.repeat_mode,
					default: choices.repeat_mode[0].id,
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
					choices: choices.incrPlay_mode,
					default: choices.incrPlay_mode[0].id,
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
					choices: choices.remoteLocal_mode,
					default: choices.remoteLocal_mode[0].id,
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
					choices: choices.play_mode,
					default: choices.play_mode[0].id,
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
		/* currentTrackTime: {
			name: 'Current Track Time',
			description:
				'CURRENT TRACK TIME SENSE requests the controlled device to return the selected time information about the current track or the whole media, when in a playback or a ready state.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Time Mode',
					choices: choices.currentTrackTime_sense,
					default: choices.currentTrackTime_sense[0].id,
				},
			],
			callback: ({ options }) => {
				self.recorder.track.currentTrackTimeMode = options.mode
				self.addCmdtoQueue(SOM + cmd.currentTrackTimeSense + self.recorder.track.currentTrackTimeMode)
			},
			//learn: () => {},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.currentTrackInfoSense)
			},
		}, */
		deviceSelect: {
			name: 'Device Select',
			description: 'DEVICE SELECT changes the device to be used on the controlled device.',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Device',
					choices: choices.deviceSelect_mode,
					default: choices.deviceSelect_mode[0].id,
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.deviceSelect + options.mode)
				this.addCmdtoQueue(SOM + cmd.mechaStatusSense)
				this.addCmdtoQueue(SOM + cmd.mediaStatusSense)
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
					choices: choices.playArea_mode,
					default: choices.playArea_mode[0].id,
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
					choices: choices.enter_mode,
					default: choices.enter_mode[0].id,
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
					choices: choices.back_mode,
					default: choices.back_mode[1].id,
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(SOM + cmd.back + options.mode)
			},
		},
	})
}
