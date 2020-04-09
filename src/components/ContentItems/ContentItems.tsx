import { observer } from 'mobx-react';
import * as React from 'react';

import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { AdvancedMarkdown } from '../Markdown/AdvancedMarkdown';
import { Badge, H1, H2, MiddlePanel, Row, Section, ShareLink, ShelfIcon } from '../../common-elements';
import { ContentItemModel } from '../../services/MenuBuilder';
import { GroupModel, OperationModel } from '../../services/models';
import styled from '../../styled-components';
import { Operation } from '../Operation/Operation';
import { OperationBadge } from '../SideMenu';
import { OptionsContext } from '../OptionsProvider';

@observer
export class ContentItems extends React.Component<{
  items: ContentItemModel[];
}> {
  render() {
    const items = this.props.items;
    if (items.length === 0) {
      return null;
    }
    return items.map(item => {
      return <ContentItem key={item.id} item={item} />;
    });
  }
}

export interface ContentItemProps {
  item: ContentItemModel;
}

@observer
export class ContentItem extends React.Component<ContentItemProps> {
  render() {
    const item = this.props.item;
    let content;
    const { type } = item;
    switch (type) {
      case 'group':
        content = null;
        break;
      case 'tag':
      case 'section':
        content = <SectionItem {...this.props} />;
        break;
      case 'operation':
        content = <OperationItem item={item as any} />;
        break;
      default:
        content = <SectionItem {...this.props} />;
    }

    return (
      <>
        {content && (
          <Section id={item.id} underlined={false && item.type === 'operation'} tightSpacing={item.type === 'operation'}>
            {content}
          </Section>
        )}
        {item.items && <ContentItems items={item.items} />}
      </>
    );
  }
}

const middlePanelWrap = component => <MiddlePanel compact={true}>{component}</MiddlePanel>;

@observer
export class SectionItem extends React.Component<ContentItemProps> {
  render() {
    const { name, description, externalDocs, level } = this.props.item as GroupModel;

    const Header = level === 2 ? H2 : H1;
    return (
      <>
        <Row>
          <MiddlePanel compact={false}>
            <Header>
              <ShareLink to={this.props.item.id} />
              {name}
            </Header>
          </MiddlePanel>
        </Row>
        <AdvancedMarkdown source={description || ''} htmlWrap={middlePanelWrap} />
        {externalDocs && (
          <Row>
            <MiddlePanel>
              <ExternalDocumentation externalDocs={externalDocs} />
            </MiddlePanel>
          </Row>
        )}
      </>
    );
  }
}

const ExpandableContainer = styled.div`
  border: 1px ${props => props.theme.colors.border.dark} solid;
  border-width: 1px 0 1px 0;
`;

const ExpandableHeader = styled.div`
  padding: ${props => props.theme.spacing.unit * 2}px ${props => props.theme.spacing.sectionHorizontal}px;
  cursor: pointer;
`;

const ExpandableBody = styled.div`
  padding-bottom: ${props => props.theme.spacing.unit * 2}px;
`;

const PathH2 = styled(H2)`
  margin: 0;
  font-size: 1.2em;

  small {
    font-size: 85%;
  }
`;

const LargeOperationBadge = styled(OperationBadge)`
  margin-top: 0;
  font-size: 14px;
  width: 80px;
  height: 23px;
  line-height: 23px;
  border-radius: 3px;
  background-position: 0px 0px;
  margin-top: -1px;
`;

@observer
export class OperationItem extends React.Component<{
  item: OperationModel;
}, { expanded: boolean }> {
  constructor(props: { item: OperationModel; }) {
    super(props);

    this.state = {
      expanded: false,
    };
  }
  render() {
    const operation = this.props.item;
    const { name: summary, deprecated, path, httpVerb } = operation;
    const { expanded } = this.state;

    return <>
      <OptionsContext.Consumer>
        {options => options.swaggerHubStyle ? <>
          <ExpandableContainer>
            <ExpandableHeader onClick={this.toggleExpanded}>
              <PathH2>
                <ShareLink to={operation.id} />
                <ShelfIcon
                  float={'right'}
                  color="black"
                  size={'25px'}
                  direction={expanded ? 'up' : 'down'}
                  style={{ marginRight: '-25px' }}
                />
                <LargeOperationBadge type={httpVerb}>{httpVerb}</LargeOperationBadge>
                <code>{path}</code>
                &nbsp;
                &nbsp;
                {deprecated && <Badge type="warning"> Deprecated </Badge>}

                {!options.hideSummary && summary.trim().length > 0 ? <><br /><small>{summary || ''}</small></> : <></>}
              </PathH2>
            </ExpandableHeader>
            {expanded ? <ExpandableBody>
              <Operation operation={operation} />
            </ExpandableBody> : <></>}
          </ExpandableContainer>
        </> : <Operation operation={operation} />
        }
      </OptionsContext.Consumer>
    </>;
  }

  toggleExpanded = (_: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ expanded: !this.state.expanded });
  }
}
