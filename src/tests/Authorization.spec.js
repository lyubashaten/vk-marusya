// Моки для всех зависимостей
jest.mock('pinia');
jest.mock('axios');
jest.mock('vue-router', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
    useRoute: jest.fn(() => ({ params: {}, query: {} })),
}));
// мок для стора
jest.mock('@/store/useAuthStore', () => ({
    useAuthStore: () => ({
        login: jest.fn(({ email, password }) => {
            if (email === 'test@example.com' && password === 'password') {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Неверные данные'));
        }),
    }),
}));
import { render, fireEvent, waitFor } from '@testing-library/vue';
import AuthorizationPage from '../components/AuthorizationPage.vue';
describe('AuthorizationPage.vue', () => {
    it('рендерит все элементы формы', () => {
        const { getByPlaceholderText, getByText } = render(AuthorizationPage);
        expect(getByPlaceholderText('Электронная почта')).toBeTruthy();
        expect(getByPlaceholderText('Пароль')).toBeTruthy();
        expect(getByText('Войти')).toBeTruthy();
        expect(getByText('Регистрация')).toBeTruthy();
    });
    it('показывает ошибку при пустых полях и сабмите', async () => {
        const { getByText, getByRole } = render(AuthorizationPage);
        const submitBtn = getByRole('button', { name: /войти/i });
        await fireEvent.click(submitBtn);
        expect(getByText('Заполните все обязательные поля корректно')).toBeTruthy();
    });
    it('показывает ошибку при неверных данных', async () => {
        const { getByPlaceholderText, getByRole, findByText } = render(AuthorizationPage);
        const emailInput = getByPlaceholderText('Электронная почта');
        const passwordInput = getByPlaceholderText('Пароль');
        const submitBtn = getByRole('button', { name: /войти/i });
        await fireEvent.update(emailInput, 'wrong@example.com');
        await fireEvent.update(passwordInput, 'wrongpass');
        await fireEvent.click(submitBtn);
        const error = await findByText('Неверные данные');
        expect(error).toBeTruthy();
    });
    it('вызывает emit close при успешном логине', async () => {
        const { getByPlaceholderText, getByRole, emitted } = render(AuthorizationPage);
        const emailInput = getByPlaceholderText('Электронная почта');
        const passwordInput = getByPlaceholderText('Пароль');
        const submitBtn = getByRole('button', { name: /войти/i });
        await fireEvent.update(emailInput, 'test@example.com');
        await fireEvent.update(passwordInput, 'password');
        await fireEvent.click(submitBtn);
        await waitFor(() => {
            expect(emitted()).toHaveProperty('close');
        });
    });
    it('вызывает emit switchToRegister при клике на кнопку регистрации', async () => {
        const { getByText, emitted } = render(AuthorizationPage);
        const registerBtn = getByText('Регистрация');
        await fireEvent.click(registerBtn);
        expect(emitted()).toHaveProperty('switchToRegister');
    });
});
