import React            from 'react';
import ReactDOM         from 'react-dom';
import { Link }         from 'react-router';
import lightVizClient   from '../../client';
import equals           from 'mout/src/array/equals';

import style            from 'LightVizStyle/ListDatasets.mcss';

export default React.createClass({

  displayName: 'ThumbnailList',

  propTypes: {
    list: React.PropTypes.array,
  },

  getInitialState() {
    return {
      currentThumbnail: null,
      thumbnailIndices: [],
    };
  },

  componentWillMount() {
    const indices = [];
    for (let i = 0; i < this.props.list.length; ++i) {
      indices.push(0);
    }
    this.setState({
      thumbnailIndices: indices,
    });
  },

  componentDidMount() {
    this.timer = setInterval(this.tick, 5000);
  },

  componentWillReceiveProps(nextProps) {
    if (!equals(nextProps.list, this.props.list)) {
      this.setState({
        thumbnailIndices: [],
      });
    }
  },

  componentDidUpdate() {
    /* Load thumbnails */
    const images = ReactDOM.findDOMNode(this).querySelectorAll('img');
    let count = images.length;
    while (count--) {
      lightVizClient.addThumbnail(images[count]);
    }
  },

  componentWillUnmount() {
    clearInterval(this.timer);
  },

  setCurrentThumbnail(e) {
    const currentThumbnail = e.target.dataset.index;
    this.setState({ currentThumbnail });
  },

  clearCurrentThumbnail() {
    this.setState({ currentThumbnail: null });
  },

  tick() {
    const newIndices = [];
    for (let i = 0; i < this.props.list.length; ++i) {
      newIndices.push(this.state.thumbnailIndices.length > i ? this.state.thumbnailIndices[i] : 0);
    }
    if (this.state.currentThumbnail !== null) {
      newIndices[this.state.currentThumbnail] =
        (newIndices[this.state.currentThumbnail] + 1) %
          this.props.list[this.state.currentThumbnail].thumbnails.length;
    }
    this.setState({
      thumbnailIndices: newIndices,
    });
  },

  render() {
    const indices = [];
    for (let i = 0; i < this.props.list.length; ++i) {
      indices.push(this.state.thumbnailIndices.length === 0 ? 0 : this.state.thumbnailIndices[i]);
    }
    return (
      <div className={style.thumbnailList}>
        {this.props.list.map((ds, index) =>
          <Link
            to={`/view/${ds.name}`}
            key={index}
            data-index={index}
            onMouseEnter={this.setCurrentThumbnail}
            onMouseLeave={this.clearCurrentThumbnail}
          >
            <img
              className={style.thumbnail}
              data-index={indices[index]}
              data-name={ds.name}
              alt={ds.name}
            />
            <div className={style.thumbnailLegend}>
              <span className={style.thumbnailName}>{ds.name}</span> ({ds.size})
            </div>
          </Link>
        )}
      </div>
    );
  },
});