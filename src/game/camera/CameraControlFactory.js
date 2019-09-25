import SimpleCameraControl from './SimpleCameraControl'
import FollowCharactersCameraControl from './FollowCharactersCameraControl'
import DebugCameraControl from './DebugCameraControl'

export default class CameraControlFactory {
  static build(config, scene, camera, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin) {
    let strategy = config && config.strategy && config.strategy.strategy || 'default'
    let cameraControl

    switch (strategy) {
      case 'default':
        cameraControl = new SimpleCameraControl(config, scene, camera, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin)
        break
      case 'follow_characters':
        cameraControl = new FollowCharactersCameraControl(config, scene, camera, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin)
        break
      case 'debug':
        cameraControl = new DebugCameraControl(config, scene, camera, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin)
        break

      default:
        cameraControl = new SimpleCameraControl(config, scene, camera, visibleWidth, visibleHeight, floatingPanelWidth, mapWidth, mapHeight, margin)
    }
    return cameraControl
  }
}