
import { Select } from '@dashup/ui';
import { windowPopup } from 'window-popup';
import React, { useState, useEffect } from 'react';

// create discord connect
const ConnectDiscord = (props = {}) => {
  // state
  const [info, setInfo] = useState({});

  // get invite url
  const getInviteURL = () => {
    // get url
    let url = 'https://discord.com/oauth2/authorize?client_id=733158865633411134&scope=bot%20identify&permissions=67492928&response_type=code';

    // redirect uri
    url = url + `&redirect_uri=${encodeURIComponent(`https://${window.location.hostname}/connect/${props.connect.type}`)}`;
    url = url + `&state=${props.page.get('_id')}:${props.connect.uuid}:${props.dashup.sessionID}`;

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

  useEffect(() => {
    // check guild
    if (!props.connect.guild) return;
  
    // check guild
    props.dashup.action({
      type   : 'connect',
      struct : 'discord',
    }, 'guild', props.connect, {}).then(setInfo);
  }, [props.connect.guild]);

  // return jsx
  return (
    <div className="card mb-3">
      <div className="card-header">
        <b>Discord Connector</b>
      </div>

      { props.connect.guild ? (
        <div className="card-body">
          { !info ? (
            <div className="text-center">
              <i className="h1 fa fa-spinner fa-spin my-5" />
            </div>
          ) : (
            <>
              <div className="d-flex flex-row align-items-center mb-4">
                { !!info?.image && (
                  <img src={ info.image } className="img-fluid img-avatar rounded-circle me-2" />
                ) }
                <span>
                  Discord Server:
                  <b className="m-0">
                    { info?.name || 'Loading...' }
                  </b>
                </span>
              </div>

              { !!info?.channels?.length && (
                <div className="mb-3">
                  <label className="form-label">
                    Select Channel
                  </label>
                  <Select options={ getChannels() } value={ getChannels().filter((f) => f.selected) } onChange={ (value) => props.setConnect('channel', value?.value) } />
                </div>
              ) }

              <div>
                <label className="form-label">
                  Select Direction
                </label>
                <Select options={ getDirections() } value={ getDirections().filter((f) => f.selected) } onChange={ (value) => props.setConnect('direction', value?.value) } />
              </div>
            </>
          ) }

        </div>
      ) : (
        <div className="card-body">
          <button onClick={ (e) => onConnect(e) } className="btn btn-dark">
            <i className="fab fa-discord me-2" />
            Invite Discord Bot
          </button>
        </div>
      ) }
    </div>
  );
};

// export default
export default ConnectDiscord;