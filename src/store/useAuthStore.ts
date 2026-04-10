import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = 'https://cinemaguide.skillbox.cc'  

// Интерфейс для описания пользователя
interface User {
  email: string;
  name: string;
  surname: string;
  password?: string; 
}

export const useAuthStore = defineStore('auth', {
  // Состояние стора
  state: () => ({
    user: null as User | null,           
    isAuthModalOpen: false,              
    isRegistrationMode: false,          
    isSuccessRegistrationOpen: false,  
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,          
    usersurname: (state) => state.user?.surname, 
    userInfo: (state) => state.user ?
      `${state.user.name} ${state.user.surname} (${state.user.email})` :
      'No user',
    userInitials: (state) => {
      if (!state.user) return '';
      const firstName = state.user.name?.charAt(0) || '';
      const lastName = state.user.surname?.charAt(0) || '';
      return (firstName + lastName).toUpperCase();
    }

  },

  actions: {
    openAuthModal() {
      this.isAuthModalOpen = true
      this.isRegistrationMode = false
      this.isSuccessRegistrationOpen = false
    },

    openRegistration() {
      this.isAuthModalOpen = true
      this.isRegistrationMode = true
      this.isSuccessRegistrationOpen = false
    },

    openSuccessRegistration() {
      this.isAuthModalOpen = true
      this.isRegistrationMode = false
      this.isSuccessRegistrationOpen = true
    },

    closeModal() {
      this.isAuthModalOpen = false
      this.isRegistrationMode = false
      this.isSuccessRegistrationOpen = false
    },

    async checkAuth() {
      try {
        await this.fetchUserProfile()   
        return true                    
      } catch (error) {
        this.user = null               
        return false                   
      }
    },

    async register(data: { email: string; name: string; surname: string; password: string }) {
      try {
        console.log('Registering user:', data)

        const response = await axios.post(`${API_BASE}/user`, data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('Registration response:', response.data)

        this.openSuccessRegistration()

        return true
      } catch (e: any) {
        console.error('Ошибка регистрации', e)
        console.error('Response data:', e.response?.data)
        console.error('Response status:', e.response?.status)

        if (e.response?.status === 409) {
          throw new Error('Пользователь с таким email уже существует')
        }
        throw new Error(e.response?.data?.message || 'Ошибка регистрации. Попробуйте еще раз.')
      }
    },

    async login(credentials: { email: string; password: string }) {
      try {
        const response = await axios.post(`${API_BASE}/auth/login`, credentials, {
          withCredentials: true
        })
        const user = await this.fetchUserProfile()

        this.closeModal()              
        return response.data
      } catch (e: any) {
        console.error('Ошибка входа', e)
        console.error('Login error response:', e.response?.data)

        if (e.response?.status === 401) {
          throw new Error('Неверный email или пароль')
        }
        throw new Error(e.response?.data?.message || 'Ошибка входа. Попробуйте еще раз.')
      }
    },
    async fetchUserProfile() {
      try {
        const response = await axios.get(`${API_BASE}/profile`, {
          withCredentials: true
        })

        const userData = response.data

        let processedUser = null

        if (userData && typeof userData === 'object') {
          if (userData.name !== undefined && userData.surname !== undefined) {
            processedUser = {
              name: userData.name,
              surname: userData.surname,
              email: userData.email
            }
          }
          else if (userData.user && typeof userData.user === 'object') {
            processedUser = {
              name: userData.user.name,
              surname: userData.user.surname,
              email: userData.user.email
            }
          }
          else {
            const findValue = (obj: any, key: string): any => {
              if (obj && typeof obj === 'object') {
                if (key in obj) return obj[key]
                for (const k in obj) {
                  const result = findValue(obj[k], key)
                  if (result !== undefined) return result
                }
              }
              return undefined
            }

            const name = findValue(userData, 'name')
            const surname = findValue(userData, 'surname')
            const email = findValue(userData, 'email')

            if (name !== undefined || surname !== undefined) {
              processedUser = {
                name: name,
                surname: surname,
                email: email
              }
            }
          }
        }

        if (processedUser) {
          this.user = processedUser;
        } else {
          console.warn('Could not extract user data from response:', userData)
          this.user = null
        }

        return this.user
      } catch (e: any) {
        console.error('Ошибка получения профиля', e)
        console.error('Error response:', e.response?.data)
        this.user = null
        throw e
      }
    },
    async logout() {
      try {
        await axios.get(`${API_BASE}/auth/logout`, {
          withCredentials: true
        });

        console.log('Logout successful');
      } catch (e: any) {
        console.error('Ошибка выхода', e);

        if (e.response?.status === 405) {
          console.warn('Logout endpoint not available, clearing local state only');
        } else {
          throw e;
        }
      } finally {
        this.user = null;
        this.isAuthModalOpen = false;
        this.isRegistrationMode = false;
        this.isSuccessRegistrationOpen = false;
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    },

    async tryAutoLogin() {
      try {
        const user = await this.fetchUserProfile()  
        if (user) {
        }
        return user
      } catch (e) {
        this.user = null
        return null
      }
    }
  }
})