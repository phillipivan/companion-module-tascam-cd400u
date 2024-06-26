//const {} = require('./consts.js')

module.exports = {
	search_mode: [
		{ id: '00', label: 'Forward - Normal. AM/FM Search higher frequency' },
		{ id: '01', label: 'Reverse - Normal. AM/FM Search lower frequency' },
		{ id: '10', label: 'Forward - High speed' },
		{ id: '11', label: 'Reverse - High speed' },
	],
	skip_mode: [
		{ id: '00', label: 'Track Skip Next' },
		{ id: '01', label: 'Track Skip Previous' },
	],
	resumePlay_mode: [
		{ id: '00', label: 'Resume Play Off' },
		{ id: '01', label: 'Resume Play On' },
		{ id: 'FF', label: 'Sense' },
	],
	repeat_mode: [
		{ id: '00', label: 'Repeat Off' },
		{ id: '01', label: 'Repeat Normal' },
		{ id: 'FF', label: 'Sense' },
	],
	incrPlay_mode: [
		{ id: '00', label: 'Incremental Playback Off ' },
		{ id: '01', label: 'Incremental Playback On' },
		{ id: 'FF', label: 'Sense' },
	],
	remoteLocal_mode: [
		{ id: '00', label: 'Remote Only' },
		{ id: '01', label: 'Local and Remote' },
		{ id: '10', label: 'Serial & ETH Only' },
		{ id: '11', label: 'IR Disable' },
		{ id: 'FF', label: 'Sense' },
	],
	play_mode: [
		{ id: '00', label: 'Continuous' },
		{ id: '01', label: 'Single' },
		{ id: '06', label: 'Random' },
	],
	currentTrackTime_sense: [
		{ id: '00', label: 'Elapsed Time' },
		{ id: '01', label: 'Remain Time (CD-DA Only)' },
		{ id: '02', label: 'Total Elapsed Time (CD-DA Only)' },
		{ id: '03', label: 'Total Remain Time (CD-DA Only)' },
	],
	deviceSelect_mode: [
		{ id: '00', label: 'SD' },
		{ id: '10', label: 'USB' },
		{ id: '11', label: 'CD' },
		{ id: '20', label: 'Bluetooth' },
		{ id: '30', label: 'FM (DAB CD-400UDAB)' },
		{ id: '31', label: 'AM (FM CD-400UDAB)' },
		{ id: '40', label: 'AUX' },
		{ id: 'FF', label: 'Sense' },
	],
	playArea_mode: [
		{ id: '00', label: 'All' },
		{ id: '01', label: 'Folder, not skip mode' },
		{ id: '0F', label: 'Folder, skip mode' },
		{ id: 'FF', label: 'Sense' },
	],
	enter_mode: [
		{ id: '00', label: '(Reserved) ENTER Key - Release' },
		{ id: '01', label: 'ENTER Key - Push' },
	],
	back_mode: [
		{ id: '00', label: '(Reserved) Back Key - Release' },
		{ id: '01', label: 'Back Key - Push' },
		{ id: '20', label: 'Back Key - Push and hold (Bluetooth Pairing)' },
	],
	//feedbacks
	resumePlay_feedback: [
		{ id: '00', label: 'Resume Play Off' },
		{ id: '01', label: 'Resume Play On' },
	],
	repeat_feedback: [
		{ id: '00', label: 'Repeat Off' },
		{ id: '01', label: 'Repeat Normal' },
	],
	incrPlay_feedback: [
		{ id: '00', label: 'Incremental Playback Off ' },
		{ id: '01', label: 'Incremental Playback On' },
	],
	remoteLocal_feedback: [
		{ id: '00', label: 'Remote Only' },
		{ id: '01', label: 'Local and Remote' },
		{ id: '10', label: 'Serial & ETH Only' },
		{ id: '11', label: 'IR Disable' },
	],
	play_feedback: [
		{ id: '00', label: 'Continuous' },
		{ id: '01', label: 'Single' },
		{ id: '06', label: 'Random' },
	],
	mechaStatus_feedback: [
		{ id: '00', label: 'No Media' },
		{ id: '01', label: 'Preparing for disc ejection' },
		{ id: '10', label: 'Stop' },
		{ id: '11', label: 'Play' },
		{ id: '12', label: 'Ready On (Pause)' },
		{ id: '28', label: 'Searching forward' },
		{ id: '29', label: 'Searching backward' },
		{ id: '81', label: 'Record' },
		{ id: '82', label: 'Record Ready' },
		{ id: '83', label: 'Information Writing' },
		{ id: 'FF', label: 'Other' },
	],
	errorSense_feedback: [
		{ id: '0-00', label: 'No Error' },
		{ id: '0-01', label: 'Rec Error' },
		{ id: '1-02', label: 'Device Error' },
		{ id: '1-FF', label: 'Other Error' },
	],
	cautionSense_feedback: [
		{ id: '0-00', label: 'No Caution' },
		{ id: '1-02', label: 'Media Error' },
		{ id: '1-06', label: 'Media Full' },
		{ id: '1-0C', label: 'Write Protected' },
		{ id: '1-0D', label: 'Not Execute' },
		{ id: '1-13', label: "Can't Select" },
		{ id: '1-16', label: 'Name Full' },
		{ id: '1-1E', label: 'Decode Error' },
		{ id: '1-1F', label: 'Media Not Match' },
		{ id: '1-FF', label: 'Other Caution' },
	],
	deviceSelect_feedback: [
		{ id: '00', label: 'SD' },
		{ id: '10', label: 'USB' },
		{ id: '11', label: 'CD' },
		{ id: '20', label: 'Bluetooth' },
		{ id: '30', label: 'FM (DAB CD-400UDAB)' },
		{ id: '31', label: 'AM (FM CD-400UDAB)' },
		{ id: '40', label: 'AUX' },
	],
	playArea_feedback: [
		{ id: '00', label: 'All' },
		{ id: '01', label: 'Folder, not skip mode' },
		{ id: '0F', label: 'Folder, skip mode' },
	],
	mediaStatus_feedback: [
		{ id: '00', label: 'No Media' },
		{ id: '01', label: 'Media Loaded' },
	],
}
