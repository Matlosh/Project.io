const defaultLang = {
  menu: {
    'Home': '',
    'Projects': '',
    'Settings': ''
  },
  pages: {
    home: {

    },
    projects: {
      project_form: {
        create: {
          'Title': '',
          'Save': ''
        },
        update: {
          'Title': '',
          'Save': ''
        }
      },
      category_form: {
        create: {
          'Title': '',
          'Save': ''
        },
        update: {
          'Title': '',
          'Save': ''
        }
      },
      task_form: {
        create: {
          'Title': '',
          'Save': ''
        },
        update: {
          'Title': '',
          'Save': ''
        }
      },
      'Active tasks': '',
      'Completed': '',
      'Until': '',
      'Finished': '',
      'Todo': '',
      'Description': '',
      'Information about this task': '',
      'Full title': '',
    },
    settings: {
      'Theme': '',
      'Dark mode': ''
    }
  },
  form_fields: {
    'Title': '',
    'Color': '',
    'Picked color': '',
    'Show color picker': '',
    'Pick a color': '',
    'Save color': '',
    'Description': '',
    'Set until date': '',
    'Until date': '',
    "Task's until date": '',
    'Show date picker': '',
    'Mark this task as important': ''
  },
  form_errors: {
    'title': {
      'required': ''
    },
    'color': {
      'required': ''
    },
    'projectId': {
      'required': ''
    },
    'categoryId': {
      'required': ''
    },
    'Saving failed. Please try again.': '',
  },
  errors: {
    'Task not found.': ''
  },
  modals: {
    'What do you want to do?': '',
    'Close': '',
    'Edit': '',
    'Delete': '',
    'Are you sure?': '',
    'Yes': '',
    'No': ''
  }
};

export type defaultLang = typeof defaultLang;