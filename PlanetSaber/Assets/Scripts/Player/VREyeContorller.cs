using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VREyeContorller : MonoBehaviour {

    public bool isMove = true;
	public int tweenTime = 100;
	public string PathName = "Path1";

	public GameObject bullet;

	public GameObject target;
	public AudioClip se_shot;
	private AudioSource audioSource;
    readonly Quaternion _BASE_ROTATION = Quaternion.Euler(90, -45, 0);

    [SerializeField]
    GameObject wpEffect;
    bool isWarp = true;

	// Use this for initialization
	void Start () {
        //敵艦隊の取得

		this.target = null;
		this.audioSource = this.gameObject.GetComponent<AudioSource>();

		iTween.MoveTo(this.gameObject, iTween.Hash(
			"path", iTweenPath.GetPath (PathName),
			"time", tweenTime,
			"easeType", iTween.EaseType.linear,
			"orienttopath", true,
            "oncomplete", "onMoveComplete",
            "oncompletetarget", this.gameObject
        ));
	}
	
	// Update is called once per frame
	void Update () {
        if (!InitialSceneController.isTwinEye) {
            // ジャイロの値を獲得する
            Quaternion gyro = Input.gyro.attitude;
            Camera.main.transform.localRotation = _BASE_ROTATION * (new Quaternion(-gyro.x, -gyro.y, gyro.z, gyro.w));
         }

        //ショット発射
		if (Input.GetMouseButtonDown (0)) {
			this.enterShot();
		}

        if (this.isWarp) transform.Translate(0.0f, 0.0f, 300.0f);
	}

	void enterShot() {
        //発射音再生
        this.audioSource.PlayOneShot(this.se_shot);

        //ショット投入
        var parent = this.transform;
        Vector3 pos = this.transform.position;
        Quaternion rot = Camera.main.transform.rotation;

        GameObject blt1 = Instantiate(bullet, Vector3.zero, Quaternion.identity);
        blt1.transform.position = pos;
        blt1.transform.rotation = rot;
        blt1.transform.Translate(1, 0, 0);

        GameObject blt2 = Instantiate(bullet, Vector3.zero, Quaternion.identity);
        blt2.transform.position = pos;
        blt2.transform.rotation = rot;
        blt2.transform.Translate(-1, 0, 0);

        if (this.target) {
            //インサイトの場合はターゲットの方向を向く
            blt1.transform.LookAt(this.target.gameObject.transform);
            blt1.transform.LookAt(this.target.gameObject.transform);
        } else {
        }
    }

    void damage() {
        iTween.ShakePosition(
            this.gameObject,
            iTween.Hash(
                "y", 2,
                "x", 2,
                "time", 1.0f)
        );
    }

    public void startWarpSequence() {
        this.isWarp = true;
        wpEffect.SetActive(true);
    }

    void onMoveComplete() {
        //シーンコントローラにステージ終了を通知
        GameObject sc = GameObject.Find("SceneController");
        sc.GetComponent<SceneController>().endOfStage();
    }
}
