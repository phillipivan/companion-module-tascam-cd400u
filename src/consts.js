//export const regexpAddr = new RegExp(/^.{0,6}[^.*,`"]$/g)
export const msgDelay = 100 // Make sure that commands are sent at a minimum of 100-millisecond intervals.
export const keepAliveInterval = 1000
export const SOM = '0'
export const EOM = '\r\n'
export const EndSession = 'exit'
export const cmd = {
	infoReq: '0F',
	stop: '10',
	play: '12',
	pause: '14',
	search: '16',
	eject: '18',
	skip: '1A',
	directTrackSearchPreset: '23',
	resumePlaySelect: '34',
	repeatModeSelect: '37',
	incrPlaySelect: '3A',
	clear: '4A',
	remoteLocalModeSelect: '4C',
	playModeSelect: '4D',
	playModeSense: '4E',
	mechaStatusSense: '50',
	trackNumSense: '55',
	mediaStatusSense: '56',
	currentTrackInfoSense: '57',
	currentTrackTimeSense: '58',
	totalTrackNoTotalTimeSense: '5D',
	errorSense: '78',
	cautionSense: '79',
	vendorCommand: '7F',
	deviceSelect: '7F01',
	playAreaSelect: '7F074F',
	enter: '7F7049',
	back: '7F704A',
}

export const resp = {
	password: 'Enter Password',
	loginSuccess: 'Login Successful',
	keepAlive: 'FA',
	infoReturn: '8F',
	resumePlaySelectReturn: 'B4',
	repeatModeSelectReturn: 'B7',
	incrPlaySelectReturn: 'BA',
	remoteLocalModeReturn: 'CC',
	playModeReturn: 'CE',
	mechaStatusReturn: 'D0',
	trackNoStatusReturn: 'D5',
	trackCurrentInfoReturn: 'D7',
	trackCurrentTimeReturn: 'D8',
	totalTrackNoTotalTimeReturn: 'DD',
	errorSenseRequest: 'F0',
	cautionSenseRequest: 'F1',
	illegalStatus: 'F2',
	powerOnStatus: 'F4',
	changeStatus: 'F6',
	errorSenseReturn: 'F8',
	cautionSenseReturn: 'F9',
	venderCommandReturn: 'FF',
	deviceSelectReturn: 'FF01',
	playAreaSelectReturn: 'FF07CF',
}

export const respParam = {
	mechaStatusReturn: {
		noMedia: '00',
		stop: '10',
		play: '11',
		readyOn: '12',
		cue: '28',
		review: '29',
		record: '81',
		recordReady: '82',
		infomationWriting: '83',
		other: 'FF',
	},
}

export const cmdOnLogin = [
	cmd.errorSense,
	cmd.cautionSense,
	cmd.mechaStatusSense,
	cmd.trackNumSense,
	cmd.deviceSelect + 'FF',
	cmd.repeatModeSelect + 'FF',
	cmd.resumePlaySelect + 'FF',
	cmd.incrPlaySelect + 'FF',
	cmd.remoteLocalModeSelect + 'FF',
	cmd.playModeSelect + 'FF',
	cmd.playAreaSelect + 'FF',
]

export const cmdOnKeepAlive = [
	cmd.mechaStatusSense,
	cmd.trackNumSense,
	cmd.currentTrackInfoSense,
	cmd.currentTrackTimeSense + this.recorder.track.currentTrackTime,
]
