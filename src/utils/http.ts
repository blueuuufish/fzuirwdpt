// import { Observable } from 'vue-rx';
// import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// import {Room} from '@/shared/models/roomModel'

// /**
//  * Request 方法
//  * @param {string} url 
//  * @param {any} data 
//  * @param {'GET'|'POST'|'PUT'|'DELETE'} method
//  * @param {{headers?: object}} options 
//  */
// export default function request(url: string, data: any = {}, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', options: { headers?: object } = {}): Observable<any> {
//   const config: AxiosRequestConfig = {
//     url,
//     method,
//     headers: {
//       ...options.headers,
//       // Authorization: localStorage.getItem('token') || '',
//     },
//   };

//   if (method !== 'GET') {
//     config.data = data;
//   } else {
//     config.params = data;
//   }

//   return new Observable(observer => {
//     axios(config)
//       .then(response => {
//         observer.next(response);
//         observer.complete();
//       })
//       .catch(error => {
//         observer.error(error);
//       });

//     // Cleanup function
//     return () => {
//       // If you want to implement cancellation
//     };
//   });
// }

// /**
//  * GET 方法
//  * @param {string} url 
//  * @param {{headers?: object}} options 
//  */
// // function get(url: string, options: { headers?: object } = {}): Observable<AxiosResponse> {
// //   return request(url, null, 'GET', options);
// // }

// /**
//  * POST 方法
//  * @param {string} url 
//  * @param {any} data 
//  * @param {{headers?: object}} options 
//  */
// function post(url: string, data: any, options: { headers?: object } = {}): Observable<any> {
//   return request(url, data, 'POST', options);
// }

// /**
//  * PUT 方法
//  * @param {string} url 
//  * @param {any} data 
//  * @param {{headers?: object}} options 
//  */
// // function put(url: string, data: any, options: { headers?: object } = {}): Observable<AxiosResponse> {
// //   return request(url, data, 'PUT', options);
// // }

// /**
//  * DELETE 方法
//  * @param {string} url 
//  * @param {{headers?: object}} options 
//  */
// // function delete_(url: string, options: { headers?: object } = {}): Observable<AxiosResponse> {
// //   return request(url, null, 'DELETE', options);
// // }

// // export const http = { get, post, put, delete: delete_, request };
// export const http = { post, request };