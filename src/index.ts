import { Filter, Message } from './types';

export function filterMessages(messages: Message[], filter: Filter): Message[] {
  const applyFilter = (message: Message, filter: Filter): boolean => {
    if (filter.type === 'or') {
      return filter.filters.some((subFilter) => applyFilter(message, subFilter));
    }
    if (filter.type === 'and') {
      return filter.filters.every((subFilter) => applyFilter(message, subFilter));
    }

    const value = message[filter.field];

    switch (filter.type) {
      case 'string':
        if (typeof value !== 'string') return false;
        const stringValue = value as string;
        switch (filter.operation) {
          case 'eq':
            return stringValue === filter.value;
          case 'startsWith':
            return stringValue.startsWith(filter.value);
          case 'endsWith':
            return stringValue.endsWith(filter.value);
          case 'contains':
            return stringValue.includes(filter.value);
        }
        break;
      case 'number':
        if (typeof value !== 'number') return false;
        const numberValue = value as number;
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
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') return false;
        return value === filter.value;
      case 'date':
        const dateValue = new Date(value as string | Date);
        const filterDate = new Date(filter.value as string | Date);
        switch (filter.operation) {
          case 'eq':
            return dateValue.getTime() === filterDate.getTime();
          case 'after':
            return dateValue.getTime() > filterDate.getTime();
          case 'before':
            return dateValue.getTime() < filterDate.getTime();
        }
        break;
    }

    return false;
  };

  return messages.filter((message) => applyFilter(message, filter));
}

