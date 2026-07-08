import EmptyState from '../../../components/ui/EmptyState'
import SelectableListShell from '../../../components/ui/SelectableListShell'
import WorkspaceSectionHeading from '../../../components/ui/WorkspaceSectionHeading'
import {
  uiEmptyStateInSelectableListStyle,
  uiSelectableListRowBaseStyle,
  uiSelectableListRowInsetStyle,
  uiSelectableListRowMetaTextStyle,
  uiSelectableListRowPrimaryTextStyle,
  uiSelectableListRowSecondaryTextStyle,
  uiSelectableListRowSurface,
  uiWorkspaceListSectionStyle,
} from '../../../components/ui/uiPrimitives'
import { useGroupPageController } from '../hooks/useGroupPageController'

type GroupPageController = ReturnType<typeof useGroupPageController>

type Props = {
  ctrl: GroupPageController
}

export default function GroupListSection({ ctrl }: Props) {
  const { list, actions } = ctrl

  return (
    <section style={uiWorkspaceListSectionStyle}>
      <WorkspaceSectionHeading flushBottom>Groups</WorkspaceSectionHeading>
      <SelectableListShell>
        {!list.loading && list.groups.length === 0 && (
          <EmptyState style={uiEmptyStateInSelectableListStyle} message="No groups found." />
        )}
        {list.groups.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {list.groups.map((group) => {
              const selected = group.groupId === list.selectedGroupId
              const hovered = list.hoveredGroupId === group.groupId
              return (
                <li
                  key={group.groupId}
                  onClick={() => actions.selectGroup(group)}
                  onMouseEnter={() => actions.hoverGroupEnter(group.groupId)}
                  onMouseLeave={() => actions.hoverGroupLeave()}
                  style={{
                    ...uiSelectableListRowBaseStyle,
                    ...uiSelectableListRowInsetStyle,
                    ...uiSelectableListRowSurface(selected, hovered),
                  }}
                >
                  <div style={uiSelectableListRowPrimaryTextStyle}>{group.name}</div>
                  <div style={uiSelectableListRowSecondaryTextStyle}>{group.groupType}</div>
                  <div style={uiSelectableListRowMetaTextStyle}>
                    {group.isActive === false ? 'Inactive' : 'Active'}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </SelectableListShell>
    </section>
  )
}
