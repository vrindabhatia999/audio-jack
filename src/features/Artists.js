import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import Audio from '../components/Audio';
import Loader from '../assets/loader.gif';
import { getBgColors } from '../utils/utlis';
function Artists() {
  const CLIENT_ID = '1dcb73c13eef4439a3122081a14510cd';
  const REDIRECT_URI = 'http://localhost:3001';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  //after auth save the access token in local storage
  const [token, setToken] = useState('');
  const [artist, setArtist] = useState('');
  const [artistData, setArtistData] = useState();
  const [tracks, setTracks] = useState();
  const [artistName, setArtistName] = useState();
  const [loaded, setLoaded] = useState(true);
  const inputRef = useRef();
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '#';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem(token);
    window.localStorage.clear();
  };
  const searchArtists = (e) => {
    e.preventDefault();
    if (token) {
      fetch(`https://api.spotify.com/v1/search?query=${artist}&type=artist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setArtistName(data?.artists?.items[0]?.name);
          setArtistData(data?.artists?.items[0]?.id);
          setArtist('');
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (artistData && token) {
      setLoaded(false);
      fetch(`https://api.spotify.com/v1/artists/${artistData}/top-tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTracks(data);

          if (data) {
            getBgColors(data?.tracks?.length);
          }
          setLoaded(true);
        });
    }
  }, [artistData]);

  return (
    <div className='App'>
      audio player
      {token ? (
        <div>
          'you are logged in'
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
          Login to Spotify
        </a>
      )}
      <div className='flex justify-between pl-16 py-5 gap-16'>
        {token ? (
          <form
            onSubmit={(e) => searchArtists(e)}
            className='flex flex-col min-w-[20%]'>
            <input
              className='border-b border-blue-600 focus:outline-none'
              ref={inputRef}
              value={artist}
              required={true}
              onChange={(e) => setArtist(e.target.value)}></input>
            <button type='submit'>Search</button>
            {artistName &&
              `here are your tracks from this artist ${artistName}`}
          </form>
        ) : (
          'login again'
        )}

        <div className='flex min-w-[60%] flex-wrap gap-4 '>
          {loaded ? (
            tracks?.tracks?.map((item) => {
              return (
                <div>
                  {item?.preview_url ? (
                    <Audio
                      src={item?.preview_url}
                      songImg={item?.album?.images[0]?.url}
                    />
                  ) : (
                    'data cant be fetched enter artist name properly'
                  )}
                </div>
              );
            })
          ) : (
            <img src={Loader} height={100} width={100} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Artists;
