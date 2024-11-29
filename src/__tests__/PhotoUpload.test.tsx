import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import PhotoUpload from '../components/PhotoUpload';

describe('PhotoUpload', () => {
  test('shows error when more than 2 files selected', () => {
    const { getByLabelText, getByText } = render(<PhotoUpload />);
    const input = getByLabelText('Виберіть фото для завантаження');
    
    const files = [
      new File(['file1'], 'file1.png', { type: 'image/png' }),
      new File(['file2'], 'file2.png', { type: 'image/png' }),
      new File(['file3'], 'file3.png', { type: 'image/png' })
    ];
    
    fireEvent.change(input, { target: { files } });
    
    expect(getByText('Можна завантажити максимум 2 фото')).toBeInTheDocument();
  });
});
