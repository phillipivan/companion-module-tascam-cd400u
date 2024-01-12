export const msgDelay = 125 // Make sure that commands are sent at a minimum of 100-millisecond intervals.
export const keepAliveInterval = 5000
export const timeOutInterval = 10000 // empty cmdQueue every ten seconds when not logged in to prevent excessive queueing of old cmds.
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
	welcome: 'WELCOME TO THE CD-400U TELNET SERVER!!',
	password: 'Enter Password',
	loginSuccess: 'Login Successful',
	loginFail: 'Password Failed',
	prompt: 'CD-400U >',
	partPrompt: '0U',
	keepAlive: 'FA',
	infoReturn: '8F',
	resumePlaySelectReturn: 'B4',
	repeatModeSelectReturn: 'B7',
	incrPlaySelectReturn: 'BA',
	remoteLocalModeReturn: 'CC',
	playModeReturn: 'CE',
	mechaStatusReturn: 'D0',
	trackNoStatusReturn: 'D5',
	mediaStatusReturn: 'D6',
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
	cmd.infoReq,
	cmd.mediaStatusSense,
]

export const cmdOnKeepAlive = [cmd.mediaStatusSense, cmd.deviceSelect + 'FF', cmd.mechaStatusSense]
