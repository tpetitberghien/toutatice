const get = require('lodash/get')
const merge = require('lodash/merge')
const pLimit = require('p-limit')
const transpileGroupToCozy = require('./helpers/transpileGroupToCozy')

const synchronizeGroups = async (
  cozyUtils,
  contactAccountId,
  remoteGroups,
  cozyGroups
) => {
  const result = {
    created: 0,
    updated: 0,
    skipped: 0,
    groups: []
  }
  const promises = remoteGroups.map(remoteGroup => async () => {
    const transpiledGroup = transpileGroupToCozy(remoteGroup, contactAccountId)
    const remoteIdKey = `cozyMetadata.sync.${contactAccountId}.id`
    const remoteId = get(transpiledGroup, remoteIdKey)

    const cozyGroup = cozyGroups.find(group => {
      const cozyRemoteId = get(group, remoteIdKey)
      return cozyRemoteId === remoteId
    })

    const needsUpdate = cozyGroup && cozyGroup.name !== transpiledGroup.name

    if (!cozyGroup) {
      const created = await cozyUtils.save(transpiledGroup)
      result.groups.push(created.data)
      result.created++
    } else if (needsUpdate) {
      const merged = merge({}, cozyGroup, transpiledGroup)
      const updated = await cozyUtils.save(merged)
      result.groups.push(updated.data)
      result.updated++
    } else {
      // the group already exists and there is nothing to update
      result.groups.push(cozyGroup)
      result.skipped++
    }
  })

  const limit = pLimit(50)
  await Promise.all(promises.map(limit))
  return result
}

module.exports = synchronizeGroups
