import React from 'react';
import styled, { css } from 'styled-components';
import * as awsui from '@awsui/design-tokens';
import { Box } from '@awsui/components-react';

const LayoutContainerBox = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${awsui.colorBackgroundLayoutMain};
`;

const HeaderContainerBox = styled(Box)`
  background-color: ${awsui.colorBackgroundContainerHeader};
  box-shadow: ${({ theme }) => theme.boxShadow};
  z-index: 100;
`;

const ContentContainerBox = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: row;
  position: relative;
  overflow: hidden;
`;

const MiddleContentContainerBox = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const MiddleContentTopBar = styled(Box)`
  display: flex;
  position: relative;
  background-color: ${awsui.colorBackgroundContainerContent};
`;

const MainContentContainerBox = styled(Box)`
  flex: 1;
  overflow: hidden;
  padding: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWrapper = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.7);
`;

interface LeftPanelStyleProps {
  isFloating?: boolean;
}

const LeftPanelContainerBox = styled(Box)<LeftPanelStyleProps>`
  background-color: ${awsui.colorBackgroundContainerContent};

  ${({ isFloating }) => {
    if (isFloating) {
      return css`
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 99;
      `;
    } else {
      return css`
        flex: none;
        z-index: 99;
      `;
    }
  }}
`;

LeftPanelContainerBox.defaultProps = {
  isFloating: false,
};

const RightPanelContainerBox = styled(Box)`
  background-color: ${awsui.colorBackgroundContainerContent};
  flex: none;
  height: 100%;
`;

const FooterContainerBox = styled(Box)`
  background-color: ${awsui.colorBackgroundContainerHeader};
`;

interface IStaticLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  mainContent?: React.ReactNode;
  modalContent?: React.ReactNode;
  showModal?: boolean;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  topBar?: React.ReactNode;
}

const StaticLayout: React.FC<IStaticLayoutProps> = ({
  header,
  leftPanel,
  rightPanel,
  mainContent,
  modalContent,
  showModal,
  footer,
  topBar,
}: IStaticLayoutProps) => {
  return (
    <LayoutContainerBox>
      {!!showModal && <ModalWrapper>{modalContent}</ModalWrapper>}

      {!!header && <HeaderContainerBox>{header}</HeaderContainerBox>}

      <ContentContainerBox>
        {!!leftPanel && <LeftPanelContainerBox>{leftPanel}</LeftPanelContainerBox>}

        <MiddleContentContainerBox>
          {!!topBar && <MiddleContentTopBar padding={'xxs'}>{topBar}</MiddleContentTopBar>}
          <MainContentContainerBox>{mainContent}</MainContentContainerBox>
        </MiddleContentContainerBox>

        {!!rightPanel && <RightPanelContainerBox>{rightPanel}</RightPanelContainerBox>}
      </ContentContainerBox>

      {!!footer && <FooterContainerBox>{footer}</FooterContainerBox>}
    </LayoutContainerBox>
  );
};

export { StaticLayout };
