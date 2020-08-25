import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { PlayerControls } from './VideoPlayerUtilities';
import { Grid } from '@material-ui/core';
import './videoPlayer.css';

//todo add more comments to describe what's happening

export default class VideoPlayer extends Component {
	constructor(props) {
		super();
		this.state = {
			url: props.source,
			playing: true,
			light: false,
			// volume: 0.8,
			// muted: false,
			played: 0,
			loaded: 0,
			duration: 0,
			playbackRate: 1.0,
			// loop: false
		};
	}
	handleChangeSource = newSrc => {
		this.setState({
			url: newSrc,
			played: 0,
			loaded: 0,
		});
	};
	// handleVolumeChange = e => this.setState({ volume: parseFloat(e.target.value) });

	// handleToggleMuted = () => this.setState({ muted: !this.state.muted });

	handleSetPlaybackRate = e => this.setState({ playbackRate: (this.state.playbackRate === 1) ? 2 : 1 });

	handlePlayPause = () => this.setState({ playing: !this.state.playing });

	handlePlay = () => this.setState({ playing: true });

	handlePause = () => this.setState({ playing: false });

	handleSeekMouseDown = e => this.setState({ seeking: true });

	handleSeekChange = e => this.setState({ played: parseFloat(e.target.value) });

	handleReset = e => {this.player.seekTo(0, 'seconds');}

	handleSeekMouseUp = e => {
		this.setState({ seeking: false })
		this.player.seekTo(parseFloat(e.target.value))
	}
	handleProgress = state => {
		// We only want to update time slider if we are not currently seeking
		if (!this.state.seeking) {
			this.setState(state)
		}
	}
	handleEnded = () => this.setState({ playing: this.state.loop });

	handleDuration = (duration) => this.setState({ duration })

	handleStop = () => this.setState({ url: null, playing: false });

	ref = (player) => this.player = player;


	render() {
		return (
			<Grid container>
				<Grid item sm={12} className="player-container">
					<ReactPlayer
						ref={this.ref}
						className='react-window'
						width='100%'
						height='100%'
						url={this.state.url}
						playing={this.state.playing}
						light={this.state.light}
						playbackRate={this.state.playbackRate}
						onReady={() => console.log('onReady')}
						onStart={() => console.log('onStart')}
						onPlay={this.handlePlay}
						onPause={this.handlePause}
						onSeek={e => console.log('onSeek', e)}
						onEnded={this.handleEnded}
						onError={e => console.log('onError', e)}
						onProgress={this.handleProgress}
						onDuration={this.handleDuration} muted
						onClick={this.handlePlayPause}/>
				</Grid>
				<Grid item sm={12} className="control-box">
					<PlayerControls
						playPause={this.handlePlayPause.bind(this)}
						// toggleSpeed = {this.handleSetPlaybackRate.bind(this)}
						replay={this.handleReset.bind(this)}
						down={this.handleSeekMouseDown.bind(this)}
						change={this.handleSeekChange.bind(this)}
						up={this.handleSeekMouseUp.bind(this)}
						status={this.state}
						/>
				</Grid>
      	</Grid>
		);
	}
}