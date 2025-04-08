import { Meta, StoryFn } from '@storybook/react';
import BaseCard, { BaseCardProps } from '../../components/ui/Card/BaseCard';

export default {
  title: 'Components/Card/BaseCard',
  component: BaseCard,
  argTypes: {
    onClick: { action: 'clicked' },
  },
} as Meta<BaseCardProps>;

const Template: StoryFn<BaseCardProps> = (args) => <BaseCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Card Title',
  description: 'This is a basic card description',
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  title: 'Card With Footer',
  description: 'This card includes footer content',
  footer: (
    <>
      <div>Created: {new Date().toLocaleDateString()}</div>
      <div>Updated: {new Date().toLocaleDateString()}</div>
    </>
  ),
};

export const WithHeaderLeft = Template.bind({});
WithHeaderLeft.args = {
  title: 'Card With Left Header Content',
  description: 'This card includes content on the left side of the header',
  headerLeft: (
    <div className="bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
      P
    </div>
  ),
};

export const WithHeaderRight = Template.bind({});
WithHeaderRight.args = {
  title: 'Card With Right Header Content',
  description: 'This card includes content on the right side of the header',
  headerRight: (
    <>
      <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-green-100">Active</div>
      <button className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition-colors">
        Edit
      </button>
    </>
  ),
};

export const WithBothHeaders = Template.bind({});
WithBothHeaders.args = {
  title: 'Card With Both Headers',
  description: 'This card includes both left and right header content',
  headerLeft: (
    <div className="bg-purple-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
      T
    </div>
  ),
  headerRight: (
    <>
      <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-green-100">Active</div>
      <button className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition-colors">
        Edit
      </button>
    </>
  ),
};

export const MilestoneCard = Template.bind({});
MilestoneCard.args = {
  title: 'Project Planning Phase',
  description: 'Complete initial project planning and resource allocation',
  headerRight: (
    <>
      <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-600 text-yellow-100">In Progress</div>
      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
        Delete
      </button>
    </>
  ),
  footer: (
    <>
      <div>Start: {new Date('2023-01-01').toLocaleDateString()}</div>
      <div>Due: {new Date('2023-01-15').toLocaleDateString()}</div>
      <div>Tasks: 5</div>
    </>
  ),
};

export const TaskCard = Template.bind({});
TaskCard.args = {
  title: 'Implement Authentication',
  description: 'Set up user authentication with JWT tokens',
  headerRight: (
    <>
      <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-green-100">Completed</div>
      <input type="checkbox" checked={true} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600" />
      <button className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition-colors">
        Edit
      </button>
      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
        Delete
      </button>
    </>
  ),
  footer: (
    <>
      <div>Created: {new Date('2023-01-05').toLocaleDateString()}</div>
      <div>Updated: {new Date('2023-01-10').toLocaleDateString()}</div>
      <div>Milestone: Project Planning Phase</div>
    </>
  ),
};

export const ProjectCard = Template.bind({});
ProjectCard.args = {
  title: 'Project Management System',
  description: 'A system to manage projects, tasks, and milestones',
  headerRight: (
    <>
      <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-blue-100">Active</div>
      <button className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition-colors">
        View
      </button>
    </>
  ),
  footer: (
    <>
      <div>Created: {new Date('2022-12-01').toLocaleDateString()}</div>
      <div>Milestones: 4</div>
      <div>Tasks: 25</div>
    </>
  ),
};
