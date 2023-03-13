import * as React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import { ResourceExplorerBreadcrumbs } from './breadcrumbs';
import type { BreadcrumbItem } from './breadcrumbs';

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

describe('ResourceExplorerBreadcrumbs', () => {
  it('should call handleCrumbClick with the correct item when a crumb is clicked', () => {
    const crumbs = [
      { name: 'Crumb 1', text: 'Crumb 1', href: '', id: 'Crumb1' },
      { name: 'Crumb 2', text: 'Crumb 2', href: '', id: 'Crumb2' },
      { name: 'Crumb 3', text: 'Crumb 3', href: '', id: 'Crumb3' },
    ] as BreadcrumbItem[];
    const handleCrumbClickMock = jest.fn();
    const setCrumbsMock = jest.fn();

    const { getByText } = render(
      <ResourceExplorerBreadcrumbs handleCrumbClick={handleCrumbClickMock} setCrumbs={setCrumbsMock} crumbs={crumbs} />
    );
    const crumb1 = getByText('Crumb 1');

    act(() => {
      fireEvent.click(crumb1);
    });

    expect(handleCrumbClickMock).toHaveBeenCalledWith(crumbs[0]);
  });

  it('should call setCrumbs with the correct item when a crumb is clicked', () => {
    const crumbs = [
      { name: 'Crumb 1', text: 'Crumb 1', href: '', id: 'Crumb1' },
      { name: 'Crumb 2', text: 'Crumb 2', href: '', id: 'Crumb2' },
      { name: 'Crumb 3', text: 'Crumb 3', href: '', id: 'Crumb3' },
    ] as BreadcrumbItem[];
    const handleCrumbClickMock = jest.fn();
    const setCrumbsMock = jest.fn();

    const { getByText } = render(
      <ResourceExplorerBreadcrumbs handleCrumbClick={handleCrumbClickMock} setCrumbs={setCrumbsMock} crumbs={crumbs} />
    );
    const crumb1 = getByText('Crumb 1');

    act(() => {
      fireEvent.click(crumb1);
    });

    expect(setCrumbsMock).toHaveBeenCalledWith([crumbs[0]]);
  });

  it('should call setCrumbs with the correct items when a crumb other than the first is clicked', () => {
    const crumbs = [
      { name: 'Crumb 1', text: 'Crumb 1', href: '', id: 'Crumb1' },
      { name: 'Crumb 2', text: 'Crumb 2', href: '', id: 'Crumb2' },
      { name: 'Crumb 3', text: 'Crumb 3', href: '', id: 'Crumb3' },
    ] as BreadcrumbItem[];
    const handleCrumbClickMock = jest.fn();
    const setCrumbsMock = jest.fn();

    const { getByText } = render(
      <ResourceExplorerBreadcrumbs handleCrumbClick={handleCrumbClickMock} setCrumbs={setCrumbsMock} crumbs={crumbs} />
    );
    const crumb2 = getByText('Crumb 2');

    act(() => {
      fireEvent.click(crumb2);
    });

    expect(setCrumbsMock).toHaveBeenCalledWith([crumbs[0], crumbs[1]]);
  });

  it('should not call setCrumbs when the last crumb is clicked', () => {
    const crumbs = [
      { name: 'Crumb 1', text: 'Crumb 1', href: '', id: 'Crumb1' },
      { name: 'Crumb 2', text: 'Crumb 2', href: '', id: 'Crumb2' },
      { name: 'Crumb 3', text: 'Crumb 3', href: '', id: 'Crumb3' },
    ] as BreadcrumbItem[];
    const handleCrumbClickMock = jest.fn();
    const setCrumbsMock = jest.fn();

    const { getByText } = render(
      <ResourceExplorerBreadcrumbs handleCrumbClick={handleCrumbClickMock} setCrumbs={setCrumbsMock} crumbs={crumbs} />
    );
    const crumb3 = getByText('Crumb 3');

    act(() => {
      fireEvent.click(crumb3);
    });

    expect(setCrumbsMock).not.toHaveBeenCalled();
  });
});
