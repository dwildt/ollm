import { useParams, useSearchParams } from 'react-router-dom';
import { templateService } from '../services/templateService';

export const useTemplateFromUrl = () => {
  const { templateSlug } = useParams<{ templateSlug?: string }>();
  const [searchParams] = useSearchParams();

  const template = templateSlug ? templateService.getTemplate(templateSlug) : null;
  const parameters = Object.fromEntries(searchParams.entries());

  // Only return parameters if we have a valid template
  const validatedParameters = template ? parameters : {};

  return { 
    template, 
    parameters: validatedParameters,
    hasTemplate: !!template,
    hasParameters: Object.keys(validatedParameters).length > 0
  };
};