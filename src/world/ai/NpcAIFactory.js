import IdleAI from './IdleAI'
import FollowPathAI from './FollowPathAI'
import KronosAI from './KronosAI'
import GatekeeperAI from './GatekeeperAI'
import ChortAI from './ChortAI'

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
      case 'kronos':
        ai = new KronosAI(world, npc, aiConfig)
        break
      case 'gatekeeper':
        ai = new GatekeeperAI(world, npc, aiConfig)
        break
      case 'chort':
        ai = new ChortAI(world, npc, aiConfig)
        break
      default:
        ai = new IdleAI(world, npc)
    }
    return ai
  }
}