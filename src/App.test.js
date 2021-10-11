import { render, screen } from '@testing-library/react';
import App from './App';

test('renders queryAll', () => {
  render(<App />);
  const linkElement = screen.getByText(/查询全部/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders queryUsers', () => {
  render(<App />);
  const linkElement = screen.getByText(/条件查询/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders modify', () => {
  render(<App />);
  const linkElement = screen.getByText(/修改数据/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders deleteAll', () => {
  render(<App />);
  const linkElement = screen.getByText(/清空测试数据/i);
  expect(linkElement).toBeInTheDocument();
});


