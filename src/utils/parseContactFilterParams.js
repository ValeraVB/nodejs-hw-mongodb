export const parseContactFilterParams = (query) => {
    const filter = {};
  
    if (query.type) {
      filter.contactType = query.type;
    }
  
    if (query.isFavourite !== undefined) {
      filter.isFavourite = query.isFavourite === 'true';
    }
  
    return filter;
  };
  