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

	// Use this for initialization
	void Start () {
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
		if (Input.GetMouseButtonDown (0)) {
			this.enterShot();
		}
	}

	void enterShot() {
        //発射音再生
        this.audioSource.PlayOneShot(this.se_shot);

        //ショット投入
        var parent = this.transform;
        Vector3 pos = this.transform.position;
        Quaternion rot = Camera.main.transform.rotation;

        GameObject blt1 = Instantiate(bullet, Vector3.zero, Quaternion.identity, parent);
        blt1.transform.position = pos;
        blt1.transform.rotation = rot;
        blt1.transform.Translate(1, 0, 0);

        GameObject blt2 = Instantiate(bullet, Vector3.zero, Quaternion.identity, parent);
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

    void onMoveComplete() {
    }
}
