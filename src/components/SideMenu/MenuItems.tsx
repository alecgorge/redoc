import { observer } from 'mobx-react';
import * as React from 'react';

import { IMenuItem } from '../../services';

import { MenuItem } from './MenuItem';
import { MenuItemUl } from './styled.elements';
import { OptionsContext } from '../OptionsProvider';

export interface MenuItemsProps {
  items: IMenuItem[];
  expanded?: boolean;
  onActivate?: (item: IMenuItem) => void;
  style?: React.CSSProperties;
  root?: boolean;

  className?: string;
}

@observer
export class MenuItems extends React.Component<MenuItemsProps> {
  render() {
    const { items, root, className } = this.props;
    const expanded = this.props.expanded == null ? true : this.props.expanded;
    return (
      <OptionsContext.Consumer>
        {options => <MenuItemUl
          className={className}
          style={this.props.style}
          expanded={expanded}
          {...(root ? { role: 'navigation' } : {})}
        >
          {items.filter(i => !options.swaggerHubStyle || i.type !== 'operation').map((item, idx) => (
            <MenuItem key={idx} item={item} onActivate={this.props.onActivate} withoutChildren={item.items.filter(i => !options.swaggerHubStyle || i.type !== 'operation').length === 0} />
          ))}
        </MenuItemUl>
        }
      </OptionsContext.Consumer>
    );
  }
}
