import axios from "./axios";



interface DecodedToken {
  id: number
  exp: number;
  role: string; // Adjust this to match the structure of your JWT payload
}

function jwtDecode(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
  
    return JSON.parse(jsonPayload);
  }


export const setStorage = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
   
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const decoded: DecodedToken = jwtDecode(accessToken);
    const {id , exp, role  } = decoded;
    document.cookie = `token=${accessToken}`;

    console.log(accessToken, "accessToken", exp,role)

    // Store the role in local storage
    localStorage.setItem('role', role);

   
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');


    delete axios.defaults.headers.common.Authorization;
  }
};
export const logout = () => {
  setStorage(null); // Clear the storage and reset axios defaults
  window.location.href = '/auth/signin'; // Redirect to the home or login page after logout
};


export const tokenExpired = (exp: number) => {
    // eslint-disable-next-line prefer-const
    let expiredTimer;
  
    const currentTime = Date.now();
  
    // Test token expires after 10s
    // const timeLeft = currentTime + 10000 - currentTime; // ~10s
    const timeLeft = exp * 1000 - currentTime;
  
    clearTimeout(expiredTimer);
  
    expiredTimer = setTimeout(() => {
      alert('Token expired');
     
      localStorage.removeItem('accessToken');
       
    
  
  
      window.location.href = '/auth/login';
    }, timeLeft);
  };
  
