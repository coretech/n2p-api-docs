import shell from 'shelljs'
import path from 'path'
import fs from 'fs'
import {
  quit,
  print,
  flattenAllOf,
  readFile,
  readSpecFile,
  getSpecFiles,
} from './helpers'

const basePath = path.join(__dirname, '../')
const specBase = path.join(__dirname, 'base-spec.json')

process.chdir(basePath)

interface Options {
  directory: string
  outDir: string
  version: string
}

const options: Options = {
  directory: 'webhooks',
  outDir: 'specs',
  version: 'v1',
}

// global vars
const outSpec: any = {}
let docsPath: string
const sharedResponses: any = {}

function main() {
  const directoryArg = process.argv[2] as string
  if (directoryArg) {
    options.directory = directoryArg
  }

  const outDirArg = process.argv[3] as string
  if (outDirArg) {
    options.outDir = outDirArg
  }

  const { directory } = options

  print(`processing - ${directory}`)

  // get path exists
  docsPath = path.join(basePath, 'references/', directory)
  if (!shell.test('-d', docsPath)) {
    quit('Directory does not exist', docsPath)
  }
  shell.cd(docsPath)

  buildBase()
  buildResponses()
  dirToComponents('parameters')
  dirToComponents('headers')
  dirToComponents('schemas')
  dirToComponents('examples')
  dirToComponents('securitySchemes')
  dirToComponents('callbacks')
  buildPaths();
  buildWebhooks();
  saveSpecFile();
}

/**
 * Build base of spec
 */
function buildBase(): void {
  print('Building base...', false)
  const baseSpec = readFile(specBase)

  const infoFile = path.join(docsPath, 'spec.yaml')
  const info = readFile(infoFile)

  if (!info) {
    quit(`${infoFile} is missing`)
  }

  Object.assign(outSpec, baseSpec)
  Object.assign(outSpec, info)

  if (info.version) {
    outSpec.info.version = info.version.toString()
  }

  print('done')
}

function saveSpecFile(): void {
  const { directory, version, outDir } = options

  print('Saving spec file')
  
  const dir = path.join(basePath, outDir)
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const outFile = path.join(dir, `${directory}.${options.version}.json`)

  fs.writeFileSync(outFile, JSON.stringify(outSpec, null, 2))
  print(`Successfully wrote ${outFile}`, true, 'greenBright')
}

function finish(reason: string) {
  shell.cd(docsPath)
  print(reason)
}

function buildResponses() {
  print('building responses...', false)
  if (!shell.test('-d', './responses')) {
    finish('skipped')
    return
  }

  shell.cd('./responses')

  const responseNames = getSpecFiles()

  if (!outSpec.components.responses) {
    outSpec.components.responses = {}
  }

  responseNames.forEach((responseName) => {
    const response = readSpecFile(responseName)

    if (!response) return

    // flatten
    let { schema } = response.content['application/json']
    if (schema['allOf']) {
      schema = flattenAllOf(schema['allOf'])
      response.content['application/json'].schema = {
        type: 'object',
        properties: schema,
      }
    }
    // build components.responses
    outSpec.components.responses[response.name] = {
      description: response.description,
      content: response.content,
    }

    // build shared for reuse
    sharedResponses[responseName.split('.')[1]] = {
      $ref: `#/components/responses/${response.name}`,
    }
  })

  finish('done')
}

function dirToComponents(directory: string) {
  print(`building ${directory}...`, false)
  if (!shell.test('-d', `./${directory}`)) {
    finish('skipped')
    return
  }

  shell.cd(directory)

  if (!outSpec.components[directory]) {
    outSpec.components[directory] = {}
  }

  getSpecFiles().forEach((specName) => {
    const spec = readSpecFile(specName)
    if (!spec) return
    Object.assign(outSpec.components[directory], spec)
  })

  finish('done')
}

function buildPaths() {
  print('building endpoints...', false)
  if (!shell.test('-d', './paths')) {
    finish('skipped')
    return
  }

  // build models
  shell.cd('./paths')

  // build endpoints
  const specNames = getSpecFiles()
  print(String(specNames))

  if (!specNames.length) {
    finish('skipped')
    return
  }

  specNames.forEach((specName) => {
    const spec = readSpecFile(specName)

    if (!spec) return

    const tag = spec?.tags?.[0]

    // add tag to tags array
    if (tag) {
      outSpec.tags.push(tag)
    }

    // validate paths exist
    if (!spec?.paths) {
      return
    }

    // process paths
    Object.keys(spec.paths).forEach((pathName) => {
      // get path
      const path = spec.paths[pathName]
      // loop through methods
      Object.keys(path).forEach((methodName) => {
        const method = path[methodName]
        // add tag to path if not exists
        if (!method.tags && tag) {
          method.tags = [tag.name]
        }
        // add responses
        if (method?.responses?.['200']) {
          method.responses['200'].description = 'Success'
        }
        if (method?.responses) {
          Object.assign(method.responses, sharedResponses)
        }
        // standardize parameters
        if (!method.parameters) {
          method.parameters = []
        }

        method.parameters.unshift({$ref: '#/components/parameters/Accept'})
        // method.parameters.unshift({$ref: '#/components/parameters/Authorization'})
        // IF WE WANT RATE LIMIT EXCEEDED TO HAVE EXACT DATA
        // get rate limits
        // let rateLimit: string
        // Object.keys(method.responses).forEach(response => {
        //   if (Number.parseInt(response) < 300) {
        //     rateLimit = method.responses[response]?.headers?.['x-RateLimit-Limit']?.description
        //   }
        // })
        // if (rateLimit) {
        //   console.log(rateLimit)
        // }
        // update original path
        path[methodName] = method
      })

      // update spec with parsed path
      spec.paths[pathName] = path
    })

    Object.assign(outSpec.paths, spec.paths)
    console.log(outSpec)
  })

  finish('done')
}

function buildWebhooks() {
  print(`building webhooks...`, false)
  if (!shell.test("-d", `./webhooks`)) {
    finish("skipped");
    return;
  }

  shell.cd('./webhooks')

  // get all tags
  const specNames = getSpecFiles()

  if (!specNames.length) {
    finish('skipped')
    return
  }

  specNames.forEach((specName) => {
    const spec = readSpecFile(specName)

    if (!spec) return

    let properties: {}
    if (spec['allOf']) {
      properties = flattenAllOf(spec['allOf'])
    }

    // build webhook
    outSpec.webhooks[specName] = {
      tags: ["Webhooks"],
      summary: spec["summary"],
      description: spec["description"],
      post: {
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  $ref: spec["allOf"]
                    ? `#/components/schemas/${specName}`
                    : spec["properties"].$ref,
                },
                examples: spec["examples"], // TODO separate out examples
              },
            },
          },
        },
      },
    }
    // build schema
    outSpec.components.schemas[specName] = {
      type: 'object',
      title: spec['summary'],
      description: spec['description'],
      properties,
    }
  })

  finish('done')
}

(function () {
  main()
})()
