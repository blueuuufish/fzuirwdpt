// import {jwtDecode} from 'jwt-decode';

// export function useJwtService() {
//   const extractExpiryMs = (token:string) => {
//     try {
//       const details = jwtDecode(token);
//       return details.exp ? details.exp * 1000 : 0;
//     } catch (error) {
//       console.error('Invalid token:', error);
//       return 0;
//     }
//   };

//   const extractUser = (token:string) => {
//     try {
//       const details = jwtDecode(token);
//       return {
//         id: details.id,
//         username: details.sub,
//         role: details.role,
//       };
//     } catch (error) {
//       console.error('Invalid token:', error);
//       return null;
//     }
//   };

//   return {
//     extractExpiryMs,
//     extractUser,
//   };
// }
