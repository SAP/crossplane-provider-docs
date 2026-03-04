/* eslint-disable import/no-unresolved */
import React, { Children } from 'react';

function colorClassnameForType(type) {
  switch (type) {
    case CONCEPT:
      return 'concept';  
    case IN_DEV:
      return 'in-dev';  
    case BETA:
      return 'beta';  
    case READY:
      return 'ready'; 
    case IN_PREVIEW:
      return 'in-preview';
    case RESTRICTION:
      return 'restiction'; 
    case DEPRECATED:
      return 'deprecated';    
    case NA:
      return 'na';  
    default:
      return '';  
  }
}

export const POSITION_DEFAULT = "default";
export const POSITION_HEADLINE = "headline";

function labelForType(type) {
  switch (type) {
    case CONCEPT:
      return 'Planned';  
    case IN_DEV:
      return 'Development';  
    case BETA:
      return 'Beta';  
    case READY:
      return 'Ready'; 
    case RESTRICTION:
      return 'Limited'; 
    case DEPRECATED:
      return 'Deprecated';
    case IN_PREVIEW:
      return 'in Preview';
    case NA:
      return 'N/A';
    default:
      return '*';  
  }
}

function descriptionForType(type) {
  switch (type) {
    case CONCEPT:
      return 'This feature is still in ideation phase.';  
    case IN_DEV:
      return 'This feature is currently in development.';  
    case BETA:
      return 'red';  
    case DEPRECATED:
      return 'red'; 
    case RESTRICTION:
      return 'this feature is usable only in certain conditions';      
    case NA:
      return 'This feature is not available';
    case IN_PREVIEW:
      return 'The feature is availalbe in preview mode.';
    default:
      return '';  
  }
}

export const NEUTRAL = "neutral";
export const CONCEPT = "concept";
export const READY = "ready";
export const IN_PREVIEW = "in Preview";
export const IN_DEV = "in-development";
export const BETA = "beta";
export const RESTRICTION = "restrictied";
export const DEPRECATED = "deprecated";
export const NA = "na";

//TODO: Dynamic color based on type
//TODO: Allow links, e.g. work items/feature requests
//TODO: Allow custom labels

export default function Badge(props) {
  return (
    <span 
      className={`${props.isHeadline == true ? 'Badge-headline' : 'Badge'} ${colorClassnameForType(props.type)}`}
      customlabel={labelForType(props.type)} 
      // customcolor={colorForType(props.type)}
      title={descriptionForType(props.type)}
    >
    </span>
  );
}
