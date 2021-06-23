
import { Select } from '@dashup/ui';
import { windowPopup } from 'window-popup';
import React, { useState } from 'react';

// create discord connect
const ConnectDiscord = (props = {}) => {
  // state
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(null);

  // set connect
  const setConnect = (key, value = null, prev = false) => {
    // run props
    props.setConnect(props.connect, key, value, prev);
  };

  // on channel
  const onChannel = (channel) => {
    // set connect
    setConnect({
      title   : `${info.name}: #${channel.name}`,
      channel : channel.id,
    });
  };

  // get invite url
  const getInviteURL = () => {
    // get url
    let url = 'https://discord.com/oauth2/authorize?client_id=733158865633411134&scope=bot%20identify&permissions=67492928&response_type=code';

    // redirect uri
    url = url + `&redirect_uri=${encodeURIComponent(`https://${window.location.hostname}/connect/${props.connect.type}`)}`;
    url = url + `&state=${props.page.get('_id')}:${props.connect.uuid}:${props.session}`;

    // return url
    return url;
  };

  // on connect
  const onConnect = (e) => {
    // prevent
    e.preventDefault();
    e.stopPropagation();

    // window popup
    const w = windowPopup(500, 700, getInviteURL(), 'Connect Discord');
  };

  // get directions
  const getDirections = () => {
    // return value
    return [['Both Ways', 'both'], ['Discord => Dashup only', 'discord'], ['Dashup => Discord only', 'dashup']].map((sync) => {
      // return channel
      return {
        label    : sync[0],
        value    : sync[1],
        selected : props.connect.direction === sync[1],
      };
    });
  };

  // get channels
  const getChannels = () => {
    // return value
    return (info?.channels || []).map((channel) => {
      // return channel
      return {
        channel,
        label    : `#${channel.name}`,
        value    : channel.id,
        selected : props.connect.channel === channel.id,
      };
    });
  };

  // return jsx
  return (
    <div className="card mb-3">
      <div className="card-header">
        <b>Discord Connector</b>
      </div>
      <div if={ !props.connect.guild } className="card-body">
        <button onClick={ (e) => onConnect(e) } className="btn btn-dark">
          <i className="fab fa-discord mr-2" />
          Invite Discord Bot
        </button>
      </div>

      { !!props.connect.guild && (
        <div className="card-body">
          { loading === 'guild' ? (
            <div className="text-center">
              <i className="h1 fa fa-spinner fa-spin my-5" />
            </div>
          ) : (
            <>
              <div className="d-flex flex-row align-items-center mb-4">
                { !!info?.image && (
                  <img src={ info.image } className="img-fluid img-avatar rounded-circle mr-2" />
                ) }
                <span>
                  Discord Server:
                  <b className="m-0">
                    { info?.name || 'Loading...' }
                  </b>
                </span>
                <button className="btn btn-info ml-auto" onClick={ (e) => loadChannels() }>
                  <i className="fa fa-sync" />
                </button>
              </div>
  
              { !!info?.channels?.length && (
                <div className="mb-3">
                  <label className="form-label">
                    Select Channel
                  </label>
                  <Select options={ getChannels() } defaultValue={ getChannels().filter((f) => f.selected) } onChange={ (value) => onChannel(value?.channel) } />
                </div>
              ) }
  
              <div>
                <label className="form-label">
                  Select Direction
                </label>
                <Select options={ getDirections() } defaultValue={ getDirections().filter((f) => f.selected) } onChange={ (value) => setConnect('direction', value?.value) } />
              </div>
            </>
          ) }

        </div>
      ) }
    </div>
  );
};

// export default
export default ConnectDiscord;