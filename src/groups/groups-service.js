const xss = require('xss');

const GroupsService = {
  getGroupName(db, id) {
    return db
      .from('tallyit_groups AS gp')
      .select(
        'gp.group_name'
      )
      .where('gp.id', id)
      .first();
  },
  getGamesForGroup(db, id) {
    return db
      .from('tallyit_games AS g')
      .select(
        'g.id',
        'g.game_name',
        'g.date_created',
        'gp.group_name AS group'
      )
      .leftJoin(
        'tallyit_groups AS gp',
        'g.group_id',
        'gp.id'
      )
      .groupBy('g.id', 'gp.id')
      .where('g.group_id', id);
  },
  hasGroup(db, groupName) {
    return db
      .from('tallyit_groups AS gp')
      .where('gp.group_name', groupName)
      .first()
      .then(group => !!group);
  },
  validateGroup(groupName) {
    if (groupName.length > 25) {
      return 'Group name must be less than 25 characters';
    }
    if (groupName.startsWith(' ') || groupName.endsWith(' ')) {
      return 'Group name must not start or end with empty spaces';
    }
    return null;
  },
  createGroup(db, newGroup) {
    return db
      .insert(newGroup)
      .into('tallyit_groups')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  serializeGroup(group) {
    return {
      id: group.id,
      group_name: xss(group.group_name),
      date_created: new Date(group.date_created)
    };
  }
};

module.exports = GroupsService;