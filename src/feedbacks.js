import { combineRgb } from '@companion-module/base'
import { SOM, cmd } from './consts.js'
import choices from './choices.js'

export default async function (self) {
	self.setFeedbackDefinitions({
		resumePlay: {
			name: 'Resume Play',
			type: 'boolean',
			label: 'Resume Play',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Status',
					choices: choices.resumePlay_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				return options.status == self.recorder.resumePlay
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.resumePlaySelect + 'FF')
			},
		},
		repeat: {
			name: 'Repeat',
			type: 'boolean',
			label: 'Repeat',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Status',
					choices: choices.repeat_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				return options.status == self.recorder.repeat
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.repeatModeSelect + 'FF')
			},
		},
		incrPlay: {
			name: 'Incremental Play',
			type: 'boolean',
			label: 'Incremental Play',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Status',
					choices: choices.incrPlay_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				return options.status == self.recorder.incrPlay
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.incrPlaySelect + 'FF')
			},
		},
		remoteLocal: {
			name: 'Remote/Local Control',
			type: 'boolean',
			label: 'Remote/Local Control',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Status',
					choices: choices.remoteLocal_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				return options.status == self.recorder.remoteLocal
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.remoteLocalModeSelect + 'FF')
			},
		},
		playMode: {
			name: 'Play Mode',
			type: 'boolean',
			label: 'Play Mode',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Mode',
					choices: choices.play_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				return options.status == self.recorder.playMode
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.playModeSense)
			},
		},
		mechaStatus: {
			name: 'Mecha Status',
			type: 'boolean',
			label: 'Mecha Status',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Status',
					choices: choices.mechaStatus_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				let useable
				switch (self.recorder.device) {
					case '00':
					case '10':
					case '11':
						useable = true
						break
					case '20':
					case '30':
					case '31':
					case '40':
					default:
						useable = false
				}
				return options.status == self.recorder.mechaStatus && useable
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.mechaStatusSense)
			},
		},
		error: {
			name: 'Error State',
			type: 'boolean',
			label: 'Error State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'error',
					type: 'dropdown',
					label: 'Error',
					choices: choices.errorSense_feedback,
					default: '0-00',
				},
			],
			callback: ({ options }) => {
				return options.error == self.recorder.error
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.errorSense)
			},
		},
		caution: {
			name: 'Caution State',
			type: 'boolean',
			label: 'Caution State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'caution',
					type: 'dropdown',
					label: 'Caution',
					choices: choices.cautionSense_feedback,
					default: '0-00',
				},
			],
			callback: ({ options }) => {
				return options.caution == self.recorder.caution
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.cautionSense)
			},
		},
		deviceSelect: {
			name: 'Device Select',
			type: 'boolean',
			label: 'Device Select',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'device',
					type: 'dropdown',
					label: 'Device',
					choices: choices.deviceSelect_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				return options.device == self.recorder.device
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.deviceSelect + 'FF')
			},
		},
		playArea: {
			name: 'Play Area',
			type: 'boolean',
			label: 'Play Area',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'playArea',
					type: 'dropdown',
					label: 'Play Area',
					choices: choices.playArea_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				return options.playArea == self.recorder.playArea
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.playAreaSelect + 'FF')
			},
		},
		mediaStatus: {
			name: 'Media Status',
			type: 'boolean',
			label: 'Media Status',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'media',
					type: 'dropdown',
					label: 'Status',
					choices: choices.mediaStatus_feedback,
					default: '00',
				},
			],
			callback: ({ options }) => {
				return options.media == self.recorder.mediaStatus
			},
			subscribe: () => {
				self.addCmdtoQueue(SOM + cmd.mediaStatusSense)
			},
		},
	})
}
