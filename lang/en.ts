import { defaultLang } from "./default";

const en: defaultLang = {
  menu: {
    'Home': 'Home',
    'Projects': 'Projects',
    'Settings': 'Settings'
  },
  pages: {
    home: {

    },
    projects: {
      project_form: {
        create: {
          'Title': 'Create new project',
          'Save': 'Create a project'
        },
        update: {
          'Title': 'Update existing project',
          'Save': 'Update the project'
        }
      },
      category_form: {
        create: {
          'Title': 'Create new category',
          'Save': 'Create a category'
        },
        update: {
          'Title': 'Update existing category',
          'Save': 'Update the category'
        }
      },
      task_form: {
        create: {
          'Title': 'Create new task',
          'Save': 'Create a task'
        },
        update: {
          'Title': 'Update existing task',
          'Save': 'Update the task'
        }
      },
      'Active tasks': 'Active tasks',
      'Completed': 'Completed',
      'Until': 'Until',
      'Finished': 'Finished',
      'Todo': 'Todo',
      'Description': 'Description',
      'Information about this task': 'Information about this task',
      'Full title': 'Full title',
      'To Do': 'To Do',
    },
    settings: {
      'Theme': 'Theme',
      'Dark mode': 'Dark mode'
    }
  },
  form_fields: {
    'Title': 'Title',
    'Color': 'Color',
    'Picked color': 'Picked color',
    'Show color picker': 'Show color picker',
    'Pick a color': 'Pick a color',
    'Save color': 'Save color',
    'Description': 'Description',
    'Set until date': 'Set until date',
    'Until date': 'Until date',
    "Task's until date": "Task's until date",
    'Show date picker': 'Show date picker',
    'Mark this task as important': 'Mark this task as important'
  },
  form_errors: {
    'title': {
      'required': 'Title is required',
    },
    'color': {
      'required': 'Color is required'
    },
    'projectId': {
      'required': 'Project ID is required'
    },
    'categoryId': {
      'required': 'Category ID is required'
    },
    'Saving failed. Please try again.': 'Saving failed. Please try again.',
    'Operation failed. Please try again.': 'Operation failed. Please try again.',
    'Something went wrong. Please try again.': 'Something went wrong. Please try again.' 
  },
  errors: {
    'Task not found.': 'Task not found.'
  },
  modals: {
    'What do you want to do?': 'What do you want to do?',
    'Close': 'Close',
    'Edit': 'Edit',
    'Delete': 'Delete',
    'Are you sure?': 'Are you sure?',
    'Yes': 'Yes',
    'No': 'No'
  }
};

export default en;