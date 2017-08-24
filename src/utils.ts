import * as fs from 'fs-extra';

export function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if(err) { reject(err); }
      resolve(data);
    });
  });
}

export function writeFile(path: string, data: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if(err) { reject(err); return; }
      resolve(data);
    });
  });  
}

export function copy(source: string, dest: string) {
  return new Promise((resolve, reject) => {
    fs.copy(source, dest, err => {
      if (err) { reject(err); return; }
      resolve();
    });
  });  
}