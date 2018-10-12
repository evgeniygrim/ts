export class Mappable {
  public init(data?): void {
    if (data) Object.assign(this, data);
  }

  // toJson
  public toJson(): string {
    return JSON.stringify(this.toMap());
  }

  // toMap
  public toMap(obj: any = this): any {
    return this.objToMap(obj);
  }

  // objToMap
  private objToMap(obj: any = this): any {
    if (obj === null) {
      return obj;
    }
    const isObject = obj instanceof Object;
    const isMappable = obj instanceof Mappable;
    const isArray = Array.isArray(obj);
    const objValues: any = isArray ? [] : {};
    if (isMappable) {
      // Iterate over each property for this object and its prototypes.
      // We'll get each property only once regardless of how many times it exists on parent prototypes.
      for (const key in obj) {
        if (key) {
          let proto = obj;
          // Check getOwnPropertyDescriptor to see if the property is a getter.
          // It will only return the descriptor for properties on this object (not prototypes),
          // so we have to walk the prototype chain.
          while (proto) {
            const descriptor = Object.getOwnPropertyDescriptor(proto, key);
            if (descriptor && descriptor.get) {
              // Access the getter on the original object (not proto),
              // because while the getter may be defined on proto,
              // we want the property it gets to be the one from the lowest level
              const rawValue = obj[key];
              let value;
              if (Array.isArray(rawValue)) {
                // массив - следует обработать каждый элемент
                value = [];
                for (const rawItemIndex in rawValue) {
                  if (rawItemIndex) {
                    const rawItem = rawValue[rawItemIndex];
                    if (rawItem) {
                      const item = this.objToMap(rawItem);
                      value.push(item);
                    }
                  }
                }
              } else if (rawValue instanceof Object) {
                // объект - следует проанализировать геттеры
                value = this.objToMap(rawValue);
              } else {
                value = rawValue;
              }
              if (value !== undefined) {
                objValues[key] = value;
              }
              proto = null;
            } else {
              proto = Object.getPrototypeOf(proto);
            }
          }
        }
      }
    } else if (isObject) {
      // объект является обычной нетипизированной мапой или массивом
      // следует вернуть его как совокупность проверок на геттеры его элементов
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const rawValue = obj[key];
          const value = (rawValue) ? this.objToMap(rawValue) : rawValue;
          objValues[key] = value;
        }
      }
    } else {
      return obj;
    }
    return objValues;
  }

}
