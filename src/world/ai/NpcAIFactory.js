import IdleAI from './IdleAI'
import FollowPathAI from './FollowPathAI'

export default class NpcAIFactory {
  static buildAI(world, npc) {
    let aiConfig = world.findConfigObjectByID(npc.aiConfig)
    let type = aiConfig && aiConfig.type
    let ai
    switch (type) {
      case 'idle':
        ai = new IdleAI(world, npc)
        break
      case 'follow_path':
        ai = new FollowPathAI(world, npc, aiConfig)
        break
      default:
        ai = new IdleAI(world, npc)
    }
    return ai
  }
}