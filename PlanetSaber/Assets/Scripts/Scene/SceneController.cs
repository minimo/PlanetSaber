using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneController : MonoBehaviour {
	public int score;

    public GameObject enemyGroup;

	//敵機
	public GameObject enemy1;
	public GameObject enemy2;

	//隕石
	public GameObject meteo_S;
	public GameObject meteo_XXL;

	public GameObject explode1;
	public GameObject explode2;

	int time;

    //シーンフェード用
	[SerializeField]
	GameObject fadeCanvas = null;
    Fade fade = null;

    [SerializeField]
    Material skyboxWarp;
    [SerializeField]
    Material skyboxEarth;

	// Use this for initialization
	void Start () {
        //シーンフェード初期処理
        this.fade = this.fadeCanvas.GetComponent<Fade>();
//        this.fade.FadeOut(1.0f);

        //VR設定
        StartCoroutine(this.SetVRDevice("Cardboard", InitialSceneController.isTwinEye));

        //初期隕石ばら撒き
        for (int i = 0; i < 1000; i++) {
			Vector3 pos = new Vector3(Random.Range(-300, 300), Random.Range(-300, 300), Random.Range(0, 2000));
            Instantiate(meteo_S, pos, Quaternion.identity, this.enemyGroup.transform);
			pos = new Vector3(Random.Range(-300, 300), Random.Range(-300, 300), Random.Range(0, 3000));
            Instantiate(meteo_XXL, pos, Quaternion.identity, this.enemyGroup.transform);
        }
	}

	// Update is called once per frame
	void Update () {
        //一定間隔で爆発を投入
        if (time % 2 == 0) {
			Vector3 pos = new Vector3(Random.Range(-1000, 1000), Random.Range(-1000, 1000), Random.Range(-1000, 1000));
            Instantiate(explode1, pos, Quaternion.identity, this.transform);
        }

		//敵機投入
		if (this.time % 60 == 0) {
			Vector3 pos = new Vector3(Random.Range(-10, 10), Random.Range(-10, 10), Random.Range(0, 200));
            Instantiate(enemy1, pos, Quaternion.identity, this.enemyGroup.transform);
		}

		this.time++;
	}

    //ステージ終了
    public void endOfStage() {
        GameObject fleet = GameObject.Find("EnemyFleet");
        fleet.GetComponent<FleetController>().startWarpSequence();
    }

    public void changeSkybox(bool isWarp) {
        if (isWarp) {
            Camera.main.GetComponent<Skybox>().material = skyboxWarp;
        } else {
            Camera.main.GetComponent<Skybox>().material = skyboxEarth;
        }
    }

    private IEnumerator SetVRDevice(string device, bool isEnabled) {
        // デバイス読み込み
        UnityEngine.VR.VRSettings.LoadDeviceByName(device);
 
        // 待機
        yield return null; // new WaitForSeconds(0.1f);
 
        // VRモードのオン/オフ設定
        UnityEngine.VR.VRSettings.enabled = isEnabled;
//        this.fade.FadeOut(3.0f);
    }
}
