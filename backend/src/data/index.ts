import { ConversationTemplate, TemplateCollection } from '../types/templates';

// Import all template JSON files
import codeReviewTemplate from './code-review.json';
import englishTeacherTemplate from './english-teacher.json';
import spanishTeacherTemplate from './spanish-teacher.json';
import brainstormTemplate from './brainstorm.json';
import sqlOptimizerTemplate from './sql-optimizer.json';
import marketingCopyTemplate from './marketing-copy.json';

// Combine all templates into a single collection
const templates: ConversationTemplate[] = [
  codeReviewTemplate as ConversationTemplate,
  englishTeacherTemplate as ConversationTemplate,
  spanishTeacherTemplate as ConversationTemplate,
  brainstormTemplate as ConversationTemplate,
  sqlOptimizerTemplate as ConversationTemplate,
  marketingCopyTemplate as ConversationTemplate,
];

// Export as TemplateCollection format to maintain compatibility
const templateCollection: TemplateCollection = {
  templates,
};

export default templateCollection;