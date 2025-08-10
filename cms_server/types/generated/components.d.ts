import type { Schema, Struct } from '@strapi/strapi';

export interface ServiceItems extends Struct.ComponentSchema {
  collectionName: 'components_service_items';
  info: {
    displayName: 'items';
  };
  attributes: {
    item: Schema.Attribute.String;
  };
}

export interface ServiceSection extends Struct.ComponentSchema {
  collectionName: 'components_service_sections';
  info: {
    displayName: 'Section';
    icon: 'apps';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'service.items', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'service.items': ServiceItems;
      'service.section': ServiceSection;
    }
  }
}
