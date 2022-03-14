import { gatherNames, LogDesc } from "@erxes/api-utils/src/logUtils";
import { IChannelDocument } from "./models/definitions/channels";
import { IIntegrationDocument } from "./models/definitions/integrations";
import messageBroker from "./messageBroker";
import { IModels } from "./connectionResolver";

export const findFromCore = async (ids: string[], collectionName: string) => {
  return messageBroker().sendRPCMessage(
    `core:${collectionName}.find`,
    { query: { _id: { $in: ids } } }
  ) || [];
};

const findTags = async (ids: string[]) => {
  return messageBroker().sendRPCMessage('tags:find', { _id: { $in: ids } }) || [];
};

export const gatherIntegrationFieldNames = async (
  doc: IIntegrationDocument,
  prevList?: LogDesc[]
) => {
  let options: LogDesc[] = [];

  if (prevList) {
    options = prevList;
  }

  if (doc.createdUserId) {
    options = await gatherNames({
      nameFields: ['email', 'username'],
      foreignKey: 'createdUserId',
      prevList: options,
      items: await findFromCore([doc.createdUserId], 'users')
    });
  }

  if (doc.brandId) {
    options = await gatherNames({
      foreignKey: 'brandId',
      prevList: options,
      nameFields: ['name'],
      items: await findFromCore([doc.brandId], 'brands')
    });
  }

  if (doc.tagIds && doc.tagIds.length > 0) {
    options = await gatherNames({
      foreignKey: 'tagIds',
      prevList: options,
      nameFields: ['name'],
      items: await findTags(doc.tagIds)
    });
  }

  if (doc.formId) {
    options = await gatherNames({
      foreignKey: 'formId',
      prevList: options,
      nameFields: ['title'],
      items: await findFromCore([doc.formId], 'Forms')
    });
  }

  return options;
};

export const gatherChannelFieldNames = async (
  models: IModels,
  doc: IChannelDocument,
  prevList?: LogDesc[]
): Promise<LogDesc[]> => {
  let options: LogDesc[] = [];

  if (prevList) {
    options = prevList;
  }

  if (doc.userId) {
    options = await gatherNames({
      nameFields: ['userId'],
      foreignKey: 'userId',
      prevList: options,
      items: await findFromCore([doc.userId], 'users')
    });
  }

  if (doc.memberIds && doc.memberIds.length > 0) {
    options = await gatherNames({
      nameFields: ['memberIds'],
      foreignKey: 'memberIds',
      prevList: options,
      items: await findFromCore(doc.memberIds, 'users')
    });
  }

  if (doc.integrationIds && doc.integrationIds.length > 0) {
    options = await gatherNames({
      foreignKey: 'integrationIds',
      prevList: options,
      nameFields: ['name'],
      items: await models.Integrations.findIntegrations({ _id: { $in: doc.integrationIds } })
    });
  }

  return options;
};
