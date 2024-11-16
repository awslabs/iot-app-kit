import { render, screen } from '@testing-library/react';
import TextWidgetComponent from './component';
import * as ReactRedux from 'react-redux';
import type { TextProperties } from '../types';

jest.mock('~/store/actions', () => ({
  ...jest.requireActual('~/store/actions'),
  onChangeDashboardGridEnabledAction: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

jest.mock('~/customization/hooks/useIsSelected', () => ({
  useIsSelected: jest.fn(),
}));

function TextTextWidget(props: TextProperties) {
  return (
    <TextWidgetComponent
      id='id'
      type='text-widget'
      x={0}
      y={0}
      z={0}
      height={100}
      width={100}
      properties={props}
    />
  );
}

function TestReadonlyTextWidget(props: TextProperties) {
  jest.spyOn(ReactRedux, 'useSelector').mockReturnValueOnce(true);

  return <TextTextWidget {...props} />;
}

function TestEditableTextWidget(props: TextProperties) {
  jest.spyOn(ReactRedux, 'useSelector').mockReturnValueOnce(false);

  return <TextTextWidget {...props} />;
}

describe('Text Widget', () => {
  it('should render readonly text', () => {
    const text = 'text';
    render(<TestReadonlyTextWidget value={text} />);

    const textWidget = screen.getByText(text);
    expect(textWidget).toBeVisible();
    expect(textWidget).toHaveAttribute('aria-readonly');
    expect(screen.queryByRole('link', { name: text })).not.toBeInTheDocument();
  });

  it('should render editable text', () => {
    const text = 'text';
    render(<TestEditableTextWidget value={text} />);

    const textWidget = screen.getByText(text);
    expect(textWidget).toBeVisible();
    expect(textWidget).not.toHaveAttribute('aria-readonly');
    expect(screen.queryByRole('link', { name: text })).not.toBeInTheDocument();
  });

  it('should render editable link', () => {
    const text = 'text';
    const href = 'https://test.com';
    render(<TestEditableTextWidget value={text} href={href} isUrl />);

    const textWidget = screen.getByText(text);
    expect(textWidget).toHaveTextContent(text);
    expect(textWidget).not.toHaveAttribute('aria-readonly');
    expect(screen.queryByRole('link', { name: text })).not.toBeInTheDocument();
  });

  it('should santize and then render unsafe link that injects javascript', () => {
    const text = 'text';
    const href = 'javascript://%0Aalert(1)';
    render(<TestReadonlyTextWidget value={text} href={href} isUrl />);

    const textWidget = screen.getByText(text);
    expect(textWidget).toBeVisible();
    expect(textWidget).not.toHaveAttribute('href');
    expect(screen.queryByRole('link', { name: text })).not.toBeInTheDocument();
  });

  it('should santize and then render unsafe link that injects javascript via hex format', () => {
    const text = 'text';
    const href = '\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x3aalert(1)';
    render(<TestReadonlyTextWidget value={text} href={href} isUrl />);

    const textWidget = screen.getByText(text);
    expect(textWidget).toBeVisible();
    expect(textWidget).not.toHaveAttribute('href');
    expect(screen.queryByRole('link', { name: text })).not.toBeInTheDocument();
  });

  it('should render a safe link', () => {
    const text = 'text';
    const href = 'https://test.com';
    render(<TestReadonlyTextWidget value={text} href={href} isUrl />);

    const textWidget = screen.getByRole('link', { name: text });
    expect(textWidget).toBeVisible();
    expect(textWidget).toHaveAttribute('href', href);
  });
});
