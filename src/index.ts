import {
  Filter,
  Message,
  DateType,
  StringFilter,
  NumberFilter,
  BooleanFilter,
  DateFilter,
  OrFilter,
  AndFilter
} from './types';

function filterMessages(messages: Message[], filter: Filter): Message[] {
  function applyFilter(message: Message, filter: Filter): boolean {
    switch (filter.type) {
      case 'string':
        const stringValue = message[filter.field] as string;
        switch (filter.operation) {
          case 'eq':
            return stringValue === filter.value;
          case 'startsWith':
            return stringValue.startsWith(filter.value);
          case 'endsWith':
            return stringValue.endsWith(filter.value);
          case 'contains':
            return stringValue.includes(filter.value);
          default:
            return false;
        }
      case 'number':
        const numberValue = message[filter.field] as number;
        switch (filter.operation) {
          case 'eq':
            return numberValue === filter.value;
          case 'gt':
            return numberValue > filter.value;
          case 'lt':
            return numberValue < filter.value;
          case 'gte':
            return numberValue >= filter.value;
          case 'lte':
            return numberValue <= filter.value;
          default:
            return false;
        }
      case 'boolean':
        const booleanValue = message[filter.field] as boolean;
        return booleanValue === filter.value;
      case 'date':
        const dateValue = new Date(message[filter.field] as DateType);
        const filterDate = new Date(filter.value);
        switch (filter.operation) {
          case 'eq':
            return dateValue.getTime() === filterDate.getTime();
          case 'after':
            return dateValue > filterDate;
          case 'before':
            return dateValue < filterDate;
          default:
            return false;
        }
      case 'or':
        return filter.filters.some(subFilter => applyFilter(message, subFilter));
      case 'and':
        return filter.filters.every(subFilter => applyFilter(message, subFilter));
      default:
        return false;
    }
  }

  return messages.filter(message => applyFilter(message, filter));
}

export { filterMessages };

