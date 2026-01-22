import { useState } from 'react';

const AddressSearchForGoogle = () => {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!address) return;

    const apiKey =
      '937190648428-degfccal5gkaov4e2pje6legrrckdpk9.apps.googleusercontent.com'; // API 키를 여기에 넣으세요
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        setResults(data.results);
        setError('');
      } else {
        setError('주소를 찾을 수 없습니다.');
        setResults(null);
      }
    } catch (err) {
      setError('API 요청 실패');
      setResults(null);
    }
  };

  return (
    <div>
      <h1>주소 검색</h1>
      <input
        type="text"
        placeholder="주소를 입력하세요"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results && (
        <ul>
          {results.map((result) => (
            <li key={result.place_id}>
              <strong>{result.formatted_address}</strong>
              <p>
                위도: {result.geometry.location.lat}, 경도:{' '}
                {result.geometry.location.lng}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearchForGoogle;
